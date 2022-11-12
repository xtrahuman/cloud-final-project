import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { parseUserId } from '../auth/utils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todoAccess = new TodosAccess()

export async function getTodosForUser(userId): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}


export function createTodo(createTodoRequest: CreateTodoRequest, userId): Promise<TodoItem> {
    const todoId =  uuid();
    const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;   //this was the source of this error, 'Missing required key 'Bucket' in params'
    
    return todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return todoAccess.generateUploadUrl(todoId);
}