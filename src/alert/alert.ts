import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	NgZone,
	Output,
	ViewEncapsulation,
} from '@angular/core';
import { NgIf } from '@angular/common';

import { Observable } from 'rxjs';

import { NgbAlertConfig } from './alert-config';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbAlertFadingTransition } from './alert-transition';

/**
 * Alert is a component to provide contextual feedback messages for user.
 *
 * It supports several alert types and can be dismissed.
 */
@Component({
	selector: 'ngb-alert',
	exportAs: 'ngbAlert',
	standalone: true,
	imports: [NgIf],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		role: 'alert',
		'[class]': '"alert show" + (type ? " alert-" + type : "")',
		'[class.fade]': 'animation',
		'[class.alert-dismissible]': 'dismissible',
	},
	template: `
		<ng-content></ng-content>
		<button
			*ngIf="dismissible"
			type="button"
			class="btn-close"
			aria-label="Close"
			i18n-aria-label="@@ngb.alert.close"
			(click)="close()"
		>
		</button>
	`,
	styleUrls: ['./alert.scss'],
})
export class NgbAlert {
	/**
	 * If `true`, alert closing will be animated.
	 *
	 * Animation is triggered only when clicked on the close button (×)
	 * or via the `.close()` function
	 *
	 * @since 8.0.0
	 */
	@Input() animation: boolean;

	/**
	 * If `true`, alert can be dismissed by the user.
	 *
	 * The close button (×) will be displayed and you can be notified
	 * of the event with the `(closed)` output.
	 */
	@Input() dismissible: boolean;

	/**
	 * Type of the alert.
	 *
	 * Bootstrap provides styles for the following types: `'success'`, `'info'`, `'warning'`, `'danger'`, `'primary'`,
	 * `'secondary'`, `'light'` and `'dark'`.
	 */
	@Input() type: string;

	/**
	 * An event emitted when the close button is clicked. It has no payload and only relevant for dismissible alerts.
	 *
	 * @since 8.0.0
	 */
	@Output() closed = new EventEmitter<void>();

	constructor(config: NgbAlertConfig, private _element: ElementRef<HTMLElement>, private _zone: NgZone) {
		this.dismissible = config.dismissible;
		this.type = config.type;
		this.animation = config.animation;
	}

	/**
	 * Triggers alert closing programmatically (same as clicking on the close button (×)).
	 *
	 * The returned observable will emit and be completed once the closing transition has finished.
	 * If the animations are turned off this happens synchronously.
	 *
	 * Alternatively you could listen or subscribe to the `(closed)` output
	 *
	 * @since 8.0.0
	 */
	close(): Observable<void> {
		const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbAlertFadingTransition, {
			animation: this.animation,
			runningTransition: 'continue',
		});
		transition.subscribe(() => this.closed.emit());
		return transition;
	}
}
