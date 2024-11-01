import { createLogger } from '@genesislcap/foundation-logger';
import {
    AppContext,
    AppElement,
    AppElementPredicate,
    AppStyle,
    AppStylePredicate,
    AppTargetId,
    assetPredicate,
    getApp,
    registrationPredicate,
    targetIdPredicate
} from '@genesislcap/foundation-shell/app';
import { importPBCAssets } from '@genesislcap/foundation-shell/pbc';
import { toElementStyles } from '@genesislcap/foundation-utils';
import { ComposableStyles } from '@genesislcap/web-core';

const logger = createLogger('pbc-utils');

/**
 * Some of this logic already exists in shell, but exists as part of a logic chain that assumes web components.
 * After testing, we can backport the changes required.
 */

/**
 * @public
 */
export async function registerPBCs(): Promise<boolean> {
    const app = getApp();
    const pbcAssets = await importPBCAssets();
    app.registerAssets(pbcAssets);
    return app.hasAssets();
}

/**
 * @privateRemarks
 * Shared across elements and styles.
 */
const assetFilter = (
    asset: AppElement | AppStyle,
    targetId: AppTargetId,
    predicate: AppElementPredicate | AppStylePredicate = () => true,
    context: AppContext,
) => targetIdPredicate(asset, targetId) &&
    assetPredicate(asset, context) &&
    registrationPredicate(
        asset,
        predicate,
        context,
    );

/**
 * @public
 */
export function getTargetStyles(
    targetId: AppTargetId,
    predicate: AppStylePredicate = () => true
) {
    const app = getApp();
    return app.styles
        .filter(asset => assetFilter(asset, targetId, predicate, app.config.context!))
        .map((token) => token.styles)
        .flat();
}


/**
 * @public
 */
export function getTargetElements(
    targetId: AppTargetId,
    predicate: AppElementPredicate = () => true
) {
    const app = getApp();
    return app.elements
        .filter(asset => assetFilter(asset, targetId, predicate, app.config.context!))
        .map((token) => token.elements);
}

/**
 * @public
 */
export function registerStylesTarget(nativeElement: HTMLElement, targetId: AppTargetId) {
    const styles = getTargetStyles(targetId);
    if (!styles || styles.length === 0) {
        return;
    }
    applyDynamicStyles(nativeElement, styles);
}

/**
 * @public
 */
export function applyDynamicStyles(nativeElement: HTMLElement, style: ComposableStyles | ComposableStyles[]) {
    const elementStyles = toElementStyles(style);
    const styleTarget = nativeElement.shadowRoot ? nativeElement.shadowRoot : document;
    elementStyles.addStylesTo(styleTarget);
}

/**
 * @public
 */
export function customEventFactory(type: string, detail?: any) {
    return new CustomEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail,
    });
}

/**
 * @privateRemarks
 * May need to add an elementTag to routes, ie. elementTag: 'notifications-dashboard'. May remove when complete.
 * @public
 */
export function deriveElementTag(name: string): string {
    const tagName = name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    logger.debug(`Guessing pbc element tag is '${tagName}' based on '${name}'. This may be incorrect, please set pbcElementTag in route data.`);
    return tagName;
}
