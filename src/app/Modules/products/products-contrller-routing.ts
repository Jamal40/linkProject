import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../core/authGuard/auth-guard.service";
import { ProductsControllerComponent } from './products-controller.component';



const routes:Routes=[{
  path:'',component:ProductsControllerComponent,children:[ 
   {path:'controller',component:ProductsControllerComponent,canActivate:[AuthGuardService]}]
}]

@NgModule({

    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class ProductsControllerRouting{}




