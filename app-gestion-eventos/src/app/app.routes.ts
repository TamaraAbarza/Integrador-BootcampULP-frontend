import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/guard/auth.guard'; 
import { EventsComponent } from './components/events/events.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { adminGuard } from './core/guard/admin.guard'; 
import { ParticipationsComponent } from './components/participations/participations.component';
import { ParticipationsAdminComponent } from './components/participations-admin/participations-admin.component';
import { CertificateListComponent } from './components/certificate-list/certificate-list.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { publicGuard } from './core/guard/public.guard';
import { SendMailComponent } from './components/send-mail/send-mail.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [publicGuard],},
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },

  //eventos
  { path: 'eventos', component: EventsComponent, canActivate: [authGuard] },
  { path: 'evento/nuevo', component: EventFormComponent, canActivate: [adminGuard] }, //admin
  { path: 'evento/editar/:id', component: EventFormComponent, canActivate: [adminGuard] }, //admin

  //participaciones
  { path: 'participaciones', component: ParticipationsComponent, canActivate: [authGuard], },
  { path: 'certificados',component: CertificateListComponent,canActivate: [authGuard],},

  //para admin
  { path: 'participaciones/admin', component: ParticipationsAdminComponent, canActivate: [adminGuard],},
  { path: 'usuarios/admin', component: UsuariosComponent,canActivate: [adminGuard],},

  //enviar mail
  { path: 'send-mail', component: SendMailComponent, canActivate: [publicGuard]  },
  { path: 'reset-password/:token', component: ResetPasswordComponent, canActivate: [publicGuard]  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
