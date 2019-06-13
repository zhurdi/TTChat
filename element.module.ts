import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Injector, NgModule } from '@angular/core'

import { createCustomElement } from '@angular/elements'

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule],
  exports: []
})
export class ElementModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {

  }
}
