import { Todo, TODO } from "./propylon/entity/todo";

export class Management {
    constructor(){
        this.message = 'Hello User!';
        
        this.todoList = [];
        this.todoList.push(new Todo('Item 1'));
        this.todoList.push(new Todo('Item 2'));
        this.todoList.push(new Todo('Item 3'));
    
        this.newItem = '';
      }
    
      addTodo(){
        this.todoList.push(new Todo(this.newItem));
        this.newItem = '';
      }
    
      removeTodo(todo){
        if (todo.done){
          this.todoList.splice(this.todoList.indexOf(todo), 1);
        }
      }
}