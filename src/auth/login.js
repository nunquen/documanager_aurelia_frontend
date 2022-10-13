import { inject } from 'aurelia-framework';
import { AuthService } from "../services/auth-service";
import { UserHandler } from './user_handler';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject (AuthService, EventAggregator, Router, UserHandler)
export class Login {

  constructor(AuthService, EventAggregator, Router, UserHandler) {
    this.auth_service = AuthService;
    this.router = Router;
    this.ea = EventAggregator;
    this.user_handler = UserHandler;
  }

  activate() {
    this.error = null;
  }
  attached(){
    this.user_handler.user_name = null;
    this.user_handler.user_id = null;
    this.user_handler.user_password = null;
  }

  login(){
    this.error = null;
    this.auth_service.login(this.name).then(data => {
      // TODO: publish user dto instead of name
      // Publishing known user
      this.ea.publish('user', data.user);
      this.user_handler.user_name = data.user.name;
      this.user_handler.user_id = data.user.id;
      this.user_handler.user_password = data.user.password;
      this.router.navigateToRoute('home');
    }).catch(error => {
      this.error = error.message;
      console.error(`bad credentials: ${this.error}`);
      this.user_handler.user_name = null;
      this.user_handler.user_id = null;
      this.user_handler.user_password = null;
    });
  }

}
