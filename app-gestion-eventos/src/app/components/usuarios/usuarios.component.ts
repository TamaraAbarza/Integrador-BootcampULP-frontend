import { Component } from '@angular/core';
import { User } from '../../core/interfaces/user';
import { AuthService } from '../../core/services/auth.service';
import { DialogoService } from '../../core/services/dialogo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    FormsModule,
    FooterComponent,
    NavBarComponent,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  userList: User[] = [];
  paginatedUsers: User[] = [];
  pageSize = 4;
  pageIndex = 0;

  constructor(
    public _authService: AuthService,
    private _dialogService: DialogoService,
    private _confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Obtener los usuarios
  getUsers() {
    this._authService.getAllUsers().subscribe((data) => {
      this.userList = data;
      this.updatePaginatedUsers();
    });
  }

  // Actualizar la lista de usuarios paginada
  updatePaginatedUsers() {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedUsers = this.userList.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  // Manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }

  cambiarRol(id: number, nuevoRol: number): void {
    console.log(
      `Cambiando rol del usuario con ID ${id} a ${
        nuevoRol === 1 ? 'Administrador' : 'Usuario'
      }`
    );

    this._authService.updateRole(id, nuevoRol).subscribe({
      next: (response) => {
        console.log('Rol cambiado exitosamente', response);
        this._dialogService.openDialog(
          'success',
          `¡Rol cambiado exitosamente a ${
            nuevoRol === 1 ? 'Administrador' : 'Usuario'
          }!`
        );
      },
      error: (err) => {
        console.error('Error al cambiar el rol', err);
        this._dialogService.openDialog(
          'error',
          'Ocurrió un error al cambiar el rol. Por favor, inténtalo más tarde.'
        );
        this.getUsers();
      },
    });
  }

  deleteUser(id: number): void {
    this._confirmDialogService
      .openDialog(ConfirmDialogComponent, {
        title: 'Confirmación',
        message: '¿Estás seguro de que deseas eliminar a este usuario?',
      })
      .subscribe((result) => {
        if (result) {
          this._authService.deleteUser(id).subscribe({
            next: () => {
              this.userList = this.userList.filter(
                (user) => user.id !== id
              );
              console.log('¡Usuario eliminado exitosamente!');
              this._dialogService.openDialog(
                'success',
                '¡Usuario eliminado exitosamente!'
              );
              // Actualizar la lista después de borrar el evento
              this.updatePaginatedUsers();
            },
            error: (err) => {
              console.error('Error al eliminar el usuario: ', err);
              this._dialogService.openDialog(
                'error',
                'Ocurrió un error al eliminar el usuario'
              );
            },
          });
        }
      });
  }
}
