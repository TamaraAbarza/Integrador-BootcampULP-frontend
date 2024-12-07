import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogClose,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

import { MatSelectModule } from '@angular/material/select';
import { Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { Evento } from '../../core/interfaces/evento';

// dialogo
import { DialogoService } from '../../core/services/dialogo.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    MatFormFieldModule,CommonModule,FormsModule,ReactiveFormsModule,
    MatInputModule,MatButtonModule,MatDialogTitle,MatDialogContent,
    MatDialogActions,MatDatepickerModule,MatCardModule,MatSelectModule,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
  providers: [provideNativeDateAdapter(), DatePipe],
})
export class EventFormComponent implements OnInit {

  eventoForm: FormGroup;
  eventId: number = 0;
  isEditMode = false;
  
  dialogTexts = {
    buttonText: 'Crear',
    titleText: 'Crear un nuevo evento',
    descriptionText: 'Ingrese los datos del nuevo evento'
  };
 

  constructor(
    private _eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private _dialogService: DialogoService,

    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Inicializar el formulario con validaciones
    this.eventoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],  // Max 200 caracteres
    });
  }

  ngOnInit(): void {
    // Comprobar si es para editar (si se paso un id valido)
    if (this.data && this.data.eventId > 0) {
      this.eventId = this.data.eventId;
      this.isEditMode = true;

      this.dialogTexts = {
        buttonText : 'Modificar',
        titleText : 'Modificar Evento',
        descriptionText : 'Modifique los datos del evento'
      }
      
      this.loadEventData(this.eventId); 
    }
  }

  // Método para cargar los datos de un evento si estramos desde editar
  private loadEventData(id: number) {
    this._eventService.getEvent(id).subscribe({
      next: (event: Evento) => {
        console.log("Fecha desde modificar: "+event.date);
         // Extraer la hora en formato HH:mm
         const hora = this.datePipe.transform(event.date, 'HH:mm');
        // Llenar formulario
        this.eventoForm.patchValue({
          name: event.name,
          date: event.date,
          time: hora,
          location: event.location,
          description: event.description,
        });
      },
      error: (err) => {
        console.error('Error al cargar los datos del evento', err);
      },
    });
  }

  // Método para cerrar el diálogo
  onNoClick(): void {
    this.dialogRef.close();
  }

  // envío del form
  onSubmit() {
    if (this.eventoForm?.invalid) {
      return;
    }

    const eventData = this.eventoForm.value;

    // Combinar la fecha y la hora para formar un Date completo
    const date = new Date(eventData.date);  
    const time = eventData.time.split(':');  

    date.setHours(Number(time[0]), Number(time[1]), 0, 0);
    eventData.date = date;

    if (this.isEditMode && this.eventId !== null) {
      // Actualizar evento
      this._eventService.updateEvent(this.eventId, eventData).subscribe({
        next: (response) => {
          console.log('Evento actualizado', response);
          this._dialogService.openDialog('success', '¡Evento actualizado con éxito!');
          this.dialogRef.close(true); // Pasa un true cuando se cierre el diálogo
        },
        error: (err) => {
          if (err?.error?.message) {
            this._dialogService.openDialog('error', err.error.message);
          } else {
            this._dialogService.openDialog('error', 'Error al actualizar el evento');
          }
          console.error('Error al actualizar el evento:', err);
        },
      });
    } else {
      // Crear evento
      this._eventService.createEvent(eventData).subscribe({
        next: (response) => {
          console.log('Evento creado', response);
          this._dialogService.openDialog('success', '¡Evento creado con éxito!');
          this.dialogRef.close(true); // Pasa un true cuando se cierre el diálogo
        },
        error: (err) => {
          if (err?.error?.message) {
            this._dialogService.openDialog('error', err.error.message);
          } else {
            this._dialogService.openDialog('error', 'Error al crear el evento');
          }
          console.error('Error al crear el evento:', err);
        },
      });
    }
  }
}