import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'users',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./modules/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/products/products.module').then((m) => m.ProductsModule),
  },
  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}