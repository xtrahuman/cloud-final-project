import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { parseUserId } from '../auth/utils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate';
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todoAccess = new TodosAccess()

export async function getTodosForUser(userId:string): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}


export function createTodo(createTodoRequest: CreateTodoRequest, userId:string): Promise<TodoItem> {
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

export function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate> {
    return todoAccess.updateTodo(updateTodoRequest, todoId, userId);
}

export function deleteTodo(todoId: string, userId: string): Promise<string> {
    return todoAccess.deleteTodo(todoId, userId);
}