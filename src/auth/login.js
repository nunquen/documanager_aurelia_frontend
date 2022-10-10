import { inject } from 'aurelia-framework';
import { AuthService } from "../services/auth-service";
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject (AuthService, EventAggregator, Router)
export class Login {

  constructor(AuthService, EventAggregator, Router) {
    this.auth_service = AuthService;
    this.router = Router;
    this.ea = EventAggregator;
  }

  activate() {
    this.error = null;
  }

  login(){
    this.error = null;
    this.auth_service.login(this.name).then(data => {
      // TODO: publish user dto instead of name
      // Publishing known user
      this.ea.publish('user', data.user);
      this.router.navigateToRoute('home');
    }).catch(error => {
      this.error = error.message;
      console.error(`bad credentials: ${this.error}`);
    });
  }

}
