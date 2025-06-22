import { Controller, Get } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {

  constructor(private readonly http: HttpService) { }

}