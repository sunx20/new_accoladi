/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
	id: string;
}

interface JQuery {
	typeahead(options?: any): any;
}

declare var StripeCheckout: any;
declare var Stripe: any;