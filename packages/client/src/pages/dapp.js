import DappLib from '@decentology/dappstarter-dapplib';
import DOM from '../components/dom';
import '../components/action-card.js';
import '../components/action-button.js';
import '../components/text-widget.js';
import '../components/number-widget.js';
import '../components/account-widget.js';
import '../components/upload-widget.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { LitElement, html, customElement, property } from 'lit-element';

@customElement('dapp-page')
export default class DappPage extends LitElement {
	@property()
	get;
	@property()
	post;
	@property()
	title;
	@property()
	category;
	@property()
	description;

	createRenderRoot() {
		return this;
	}
	constructor(args) {
		super(args);
	}

	render() {
		let content = html`
			<div class="container m-auto">
				<div class="row fadeIn mt-3 p-2 block">
					<h2 class="text-4xl">
						🎉 Basic Beasts x Mercury Hackathon
					</h2>
					<p class="mt-3">
						Your Dapp is ready, and the world is waiting for you to
						create something amazing.
					</p>
					<button style="text-decoration: underline">
						<a href="http://localhost:3000/"
							>Go to Dapp
							<svg
								style="display:inline;"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="svg-icon feather feather-arrow-up-right"
							>
								<line x1="7" y1="17" x2="17" y2="7"></line>
								<polyline points="7 7 17 7 17 17"></polyline>
							</svg>
						</a>
					</button>
					<p class="mt-3">
						You are currently viewing your Dapp in the DappStarter
						Workspace which provides an easy way to switch between
						the Client, UI Harness, Customizer and Server web apps.
						You can view any of these in a separate browser tab by
						clicking the
						<svg
							style="display:inline;"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="svg-icon feather feather-arrow-up-right"
						>
							<line x1="7" y1="17" x2="17" y2="7"></line>
							<polyline points="7 7 17 7 17 17"></polyline>
						</svg>
						icon at the top right of the frame (try it now).
					</p>
				</div>
			</div>
		`;
		return content;
	}
}
