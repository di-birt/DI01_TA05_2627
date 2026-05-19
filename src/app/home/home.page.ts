//TODO - importamos computed y signal
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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
    // TODO TA05 - Añadimos los componentes Ionic necesarios para el formulario.
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    // TODO TA05 – Añadimos ReactiveFormsModule para habilitar [formGroup] y formControlName
    ReactiveFormsModule
  ],
})
export class HomePage {
  // TODO
  // Signal: almacena el texto del campo de búsqueda.
  // Para leer su valor en el TS usamos this.busqueda()
  // Para modificarlo usamos this.busqueda.set('nuevo valor')
  busqueda = signal<string>('');

  // TODO
  // Signal: almacena la lista de elementos.
  // Al ser un signal, cualquier computed que lo use se recalculará automáticamente
  // cuando el array cambie (p.ej. si añadimos o eliminamos elementos).
  // elementos = Elemento[]
  elementos = signal<Elemento[]>([
    { id: 1, nombre: 'Angular', descripcion: 'Framework SPA de Google', categoria: 'Frontend' },
    { id: 2, nombre: 'Ionic', descripcion: 'Framework para apps híbridas', categoria: 'Mobile' },
    { id: 3, nombre: 'TypeScript', descripcion: 'Superset tipado de JavaScript', categoria: 'Lenguaje' },
    { id: 4, nombre: 'Node.js', descripcion: 'Entorno de ejecución de JS en servidor', categoria: 'Backend' },
    { id: 5, nombre: 'Capacitor', descripcion: 'Puente nativo para apps Ionic', categoria: 'Mobile' },
  ]);

  // TODO
  // Computed: se recalcula automáticamente cuando cambia el signal "elementos".
  // Equivale al getter anterior, pero Angular solo lo recalcula si su dependencia cambia.
  // Quitamos el método get hayElementos(): boolean
  hayElementos = computed<boolean>(() => this.elementos().length > 0);

  // TODO
  // Computed: depende de AMBOS signals (busqueda y elementos).
  // Cada vez que el usuario escribe en el input o cambia la lista,
  // Angular recalcula este valor de forma eficiente.
  // Quitamos el método get elementosFiltrados(): Elemento[]
  elementosFiltrados = computed<Elemento[]>(() => {
    const texto = this.busqueda().trim().toLowerCase();
    if (!texto) {
      return this.elementos();
    }
    //TODO modificar this.busqueda.toLowerCase por texto
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

    // Guardamos sin espacios en blanco innecesarios (quitamos con trim los espacios anteriores y posteriores)
    // Si algún valor es null o undefined, lo manejamos con ?? para ponerlo a ''
    const nombreLimpio = nombre?.trim()      ?? '';
    const descripcionLimpia = descripcion?.trim() ?? '';
    const categoriaLimpia = categoria?.trim()   || undefined;

    const nuevoElemento: Elemento = {
      // Date.now() genera un id único basado en el timestamp actual
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

  // TODO (Apartado 2 – Navegación): Navegar a /detalle con el elemento seleccionado
  verDetalle(elementoHome: Elemento): void {
    // Pista: this.router.navigate(['/detalle'], { state: { elemento } });
    this.router.navigate(['/detalle'], { state: { elementoHome } });
  }

  // TODO (Apartado 1 + 3 – Event Binding): Mostrar un ion-toast al pulsar el botón
  async mostrarToast(): Promise<void> {
    // Consulta la teoría: apartado "ion-toast vs ion-alert"
    const toast = await this.toastController.create({
      message: 'Lista de tecnologías cargada correctamente',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
