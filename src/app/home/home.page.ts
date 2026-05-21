import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
// TODO TA05 - Importamos los componentes Ionic utilizados.
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
  IonList, IonItem, IonLabel, IonButton, IonInput,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  ToastController
} from '@ionic/angular/standalone';
// TODO TA05 – Formularios reactivos
// FormGroup agrupa los FormControl del formulario.
// FormControl representa cada campo individual.
// ReactiveFormsModule habilita las directivas [formGroup] y formControlName en el HTML.
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Elemento } from '../models/elemento.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
    IonList, IonItem, IonLabel, IonButton, IonInput,
    // TODO TA05 - Añadimos los componentes Ionic utilizados.
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    // TODO TA05 – Añadimos ReactiveFormsModule para habilitar [formGroup] y formControlName
    ReactiveFormsModule
  ],
})
export class HomePage {

  busqueda = signal<string>('');

  elementos = signal<Elemento[]>([
    { id: 1, nombre: 'Angular', descripcion: 'Framework SPA de Google', categoria: 'Frontend' },
    { id: 2, nombre: 'Ionic', descripcion: 'Framework para apps híbridas', categoria: 'Mobile' },
    { id: 3, nombre: 'TypeScript', descripcion: 'Superset tipado de JavaScript', categoria: 'Lenguaje' },
    { id: 4, nombre: 'Node.js', descripcion: 'Entorno de ejecución de JS en servidor', categoria: 'Backend' },
    { id: 5, nombre: 'Capacitor', descripcion: 'Puente nativo para apps Ionic', categoria: 'Mobile' },
  ]);

  hayElementos = computed<boolean>(() => this.elementos().length > 0);

  elementosFiltrados = computed<Elemento[]>(() => {
    const texto = this.busqueda().trim().toLowerCase();
    if (!texto) {
      return this.elementos();
    }

    return this.elementos().filter(e =>
      e.nombre.toLowerCase().includes(texto)
    );
  });

  private router = inject(Router);
  private toastController = inject(ToastController);

  // TODO TA05 – FormGroup: agrupa los campos del formulario.
  // Validators.required marca el campo como obligatorio.
  // Validators.minLength(3) exige un mínimo de caracteres.
  formularioElemento = new FormGroup({
    nombre:      new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    descripcion: new FormControl<string>('', [Validators.required, Validators.minLength(5)]),
    categoria:   new FormControl<string>('')
  });

  constructor() {};

  // TODO TA05 – Leer los valores del formulario con .value y añadir el nuevo elemento al signal.
  // elements.update() recibe la lista actual y devuelve una nueva lista con el elemento añadido.
  // Al final reseteamos el formulario con .reset() para dejarlo vacío.
  agregarElemento(): void {
    // Si el formulario no es válido, marcamos todos los campos como tocados
    // para que Angular muestre los errores en el HTML y salimos.
    if (this.formularioElemento.invalid) {
      this.formularioElemento.markAllAsTouched();
      return;
    }

    //TODO: Recogemos como {nombre, descripcion, categoria} los valores que vienen desde el formulario formGroup
    const { nombre, descripcion, categoria } = this.formularioElemento.value;
    //const nombre = this.formularioElemento.value.nombre;
    //const descripcion = this.formularioElemento.value.descripcion;
    //const categoria = this.formularioElemento.value.categoria;

    // Guardamos sin espacios en blanco innecesarios (quitamos con trim los espacios anteriores y posteriores)
    // Si algún valor es null o undefined, lo manejamos con ?? para ponerlo a ''
    const nombreLimpio = nombre?.trim() ?? '';
    const descripcionLimpia = descripcion?.trim() ?? '';
    const categoriaLimpia = categoria?.trim() || undefined;

    const nuevoElemento: Elemento = {
      // Para el campo id hacemos Date.now() para generar un id único basado en el timestamp actual
      id:          Date.now(),
      nombre:      nombreLimpio,
      descripcion: descripcionLimpia,
      categoria:   categoriaLimpia
    };

    // TODO TA05 – signal.update() permite modificar el array sin perder la reactividad.
    // Devolvemos un nuevo array con spread (...) para no mutar el original.
    this.elementos.update(lista => [...lista, nuevoElemento]);

    // Limpiamos el formulario tras añadir el elemento
    this.formularioElemento.reset();
  }


  verDetalle(elementoHome: Elemento): void {
    this.router.navigate(['/detalle'], { state: { elementoHome } });
  }

  async mostrarToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Lista de tecnologías cargada correctamente',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
