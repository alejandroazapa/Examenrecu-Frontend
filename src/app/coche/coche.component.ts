import { Component } from '@angular/core';
import { CocheService } from '../services/coche.service';
import { MessageService } from 'primeng/api';
import { Coche } from '../models/coche';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { NavegarComponent } from '../component/navegar/navegar.component';

@Component({
  selector: 'app-coche',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, NavegarComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './coche.component.html',
  styleUrl: './coche.component.css'
})
export class CocheComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  coches: Coche[] = [];
  titulo: string = '';
  opc: string = '';
  coche = new Coche();
  op = 0;
  visible: boolean = false;
  placaTemp: string = '';
  puertaTemp: string = '';
  isDeleteInProgress: boolean = false;
  filtroPlaca: string = '';

  constructor(
    private cocheService: CocheService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarCoches();
  }

  filtrarCoches() {
    if (this.filtroPlaca) {
      return this.coches.filter(coche => 
        coche.placa.toLowerCase().includes(this.filtroPlaca.toLowerCase())
      );
    }
    return this.coches;
  }

  listarCoches() {
    this.cocheService.getCoches().subscribe({
      next: (data) => {
        this.coches = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de coches',
        });
      },
    });
  }

  actualizarLista() {
    this.listarCoches();
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Lista de coches actualizada' 
    });
  }

  showDialogCreate() {
    this.titulo = 'Crear Coche';
    this.opc = 'Agregar';
    this.op = 0;
    this.placaTemp = '';
    this.puertaTemp = '';
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Coche';
    this.opc = 'Editar';
    this.cocheService.getCocheById(id).subscribe((data) => {
      this.coche = data;
      this.placaTemp = this.coche.placa;
      this.puertaTemp = this.coche.puerta;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteCoche(id: number) {
    this.isDeleteInProgress = true;
    this.cocheService.deleteCoche(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Coche eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarCoches();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el coche',
        });
      },
    });
  }

  addCoche(): void {
    if (!this.placaTemp || this.placaTemp.trim() === '' || 
        !this.puertaTemp || this.puertaTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La placa y puerta son obligatorios',
      });
      return;
    }

    this.coche.placa = this.placaTemp;
    this.coche.puerta = this.puertaTemp;
    
    this.cocheService.createCoche(this.coche).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Coche registrado',
        });
        this.listarCoches();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el coche',
        });
      },
    });
  }

  editCoche() {
    if (!this.placaTemp || this.placaTemp.trim() === '' || 
        !this.puertaTemp || this.puertaTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La placa y puerta son obligatorios',
      });
      return;
    }

    this.coche.placa = this.placaTemp;
    this.coche.puerta = this.puertaTemp;

    this.cocheService.updateCoche(this.coche, this.coche.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Coche actualizado',
        });
        this.listarCoches();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el coche',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addCoche();
      this.limpiar();
    } else if (this.op == 1) {
      this.editCoche();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.coche = new Coche();
    this.placaTemp = '';
    this.puertaTemp = '';
  }
}
