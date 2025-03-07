import { Injectable } from '@angular/core';
import { NgbConfig } from '../ngb-config';

/**
 * A configuration service for the [`NgbAccordionDirective`](#/components/accordion/api#NgbAccordionDirective).
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all accordions used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbAccordionConfig {
	closeOthers = false;
	destroyOnHide = true;

	/**
	 * @deprecated 14.1.0
	 */
	type: string;

	private _animation: boolean;

	constructor(private _ngbConfig: NgbConfig) {}

	get animation(): boolean {
		return this._animation === undefined ? this._ngbConfig.animation : this._animation;
	}
	set animation(animation: boolean) {
		this._animation = animation;
	}
}
