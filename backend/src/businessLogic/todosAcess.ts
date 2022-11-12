import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { Types } from 'aws-sdk/clients/s3'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {

    constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.TODOS_TABLE,
      private readonly expiration_time = process.env.SIGNED_URL_EXPIRATION,
      private readonly imageIdIndex = process.env.TODOS_CREATED_AT_INDEX,
      private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
      private readonly s3BucketName = process.env.ATTACHMENT_S3_BUCKET) {
    }
  
    async getAllTodos(userId: string): Promise<TodoItem[]> {
      console.log('Getting all todos')
  
      const queryParams = {
        TableName: this.todosTable,
        IndexName: this.imageIdIndex,
        KeyConditionExpression: "#userId = :userId",
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":userId": userId
        }
      }
      const result = await this.docClient.query(queryParams).promise();
      const items = result.Items
      return items as TodoItem[]
    }
  
    async createTodo(todo: TodoItem): Promise<TodoItem> {
     const result = await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()
  
      console.log(result)
      return todo as TodoItem
    }

    async generateUploadUrl(todoId: string): Promise<string> {
        console.log("Generating URL");

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: this.expiration_time,
        });
        console.log(url);

        return url as string;
    }
  }