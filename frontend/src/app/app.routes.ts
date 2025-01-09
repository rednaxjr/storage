import { Routes } from '@angular/router';
import { IndexLayoutComponent } from './component/layout/index/index.component';
import { UserLayoutComponent } from './component/layout/user/user.component';
import { IndexComponent } from './views/index/index.component';
 
import { AuthGuard } from './services/auth.guard';
import { DashboardComponent } from './views/user/dashboard/dashboard.component';
import { FilesComponent } from './views/user/files/files.component';

export const routes: Routes = [

    {
        path: '',
        component: IndexLayoutComponent,
        children: [
            { path: '', component: IndexComponent, }, 
        ],
    },
    {
        path: 'user',
        component: UserLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {title: 'Dashboard'}}, 
            {path: 'files', component: FilesComponent, canActivate: [AuthGuard], data: {title: 'Files'}}, 
            
        ],
    },
    { path: '', redirectTo: '/', pathMatch: 'full' },
];
