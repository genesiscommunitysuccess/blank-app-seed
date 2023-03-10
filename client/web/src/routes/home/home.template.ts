import { html } from '@microsoft/fast-element';
import type { Home } from './home';

export const HomeTemplate = html<Home>`
<div class="wrapper">
      <div class="column">
        <div class="row">
          <div class="column">
            <zero-breadcrumb role="navigation">
              <zero-breadcrumb-item href="#">Item 1</zero-breadcrumb-item>
              <zero-breadcrumb-item href="#">Item 2</zero-breadcrumb-item>
              <zero-breadcrumb-item>Item 3</zero-breadcrumb-item>
            </zero-breadcrumb>
          </div>
          <div class="column">
            <zero-button href="#" appearance="accent">Button</zero-button>
            <zero-button href="#" appearance="neutral">Button</zero-button>
            <zero-button href="#" appearance="outline">Button</zero-button>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <zero-radio-group role="radiogroup" orientation="horizontal">
              <zero-radio
                checked
                role="radio"
                aria-checked="true"
                aria-required="false"
                aria-disabled="false"
                tabindex="0"
              >
                Radio 1
              </zero-radio>
              <zero-radio
                role="radio"
                aria-checked="false"
                aria-required="false"
                aria-disabled="false"
                tabindex="-1"
              >
                Radio 2
              </zero-radio>
            </zero-radio-group>
          </div>
          <div class="column">
            <zero-checkbox
              role="checkbox"
              checked
              aria-checked="true"
              aria-required="false"
              aria-disabled="false"
              tabindex="0"
            >
              Checkbox
            </zero-checkbox>
            <zero-checkbox
              role="checkbox"
              aria-checked="false"
              aria-required="false"
              aria-disabled="false"
              tabindex="0"
            >
              Checkbox
            </zero-checkbox>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <zero-text-field
              placeholder="Text field"
              aria-label="Example text field"
              type="text"
            ></zero-text-field>
          </div>
          <div class="column">
            <zero-flipper
              role="button"
              tabindex="-1"
              class="previous"
              aria-hidden="true"
              direction="previous"
            ></zero-flipper>
            <zero-flipper
              role="button"
              tabindex="-1"
              class="next"
              aria-hidden="true"
              direction="next"
            ></zero-flipper>
            <zero-switch
              role="switch"
              checked
              aria-checked="true"
              aria-disabled="false"
              tabindex="0"
            ></zero-switch>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <zero-slider
              role="slider"
              class="horizontal"
              tabindex="0"
              aria-valuenow="5"
              aria-valuemin="0"
              aria-valuemax="10"
              aria-orientation="horizontal"
              min="0"
              max="10"
              step="1"
              orientation="horizontal"
              mode="single-value"
            ></zero-slider>
          </div>
          <div class="column">
            <zero-combobox autocomplete="both">
              <zero-option>Christopher Eccleston</zero-option>
              <zero-option>David Tenant</zero-option>
              <zero-option>Matt Smith</zero-option>
              <zero-option>Peter Capaldi</zero-option>
              <zero-option>Jodie Whittaker</zero-option>
            </zero-combobox>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <alpha-accordion expand-mode="single">
              <alpha-accordion-item slot="item" id="accordion-1" expanded="" class="expanded">
                Accordion one content
                <div slot="heading">Accordion one</div>
              </alpha-accordion-item>
              <alpha-accordion-item slot="item" id="accordion-2">
                Accordion two content
                <div slot="heading">Accordion two</div>
              </alpha-accordion-item>
              <alpha-accordion-item slot="item" id="accordion-3">
                Accordion three content
                <div slot="heading">Accordion three</div>
              </alpha-accordion-item>
            </alpha-accordion>
          </div>
          <div class="column">
            <zero-tree-view role="tree">
              <zero-tree-item
                role="treeitem"
                tabindex="0"
                aria-expanded="true"
                expanded
                selected
                class="nested"
              >
                Tree item 1
                <zero-tree-item slot="item" role="treeitem">Tree item 1 - 1</zero-tree-item>
              </zero-tree-item>
              <zero-tree-item role="treeitem" tabindex="0" aria-expanded="false" class="nested">
                Tree item 2
                <zero-tree-item slot="item" role="treeitem">Tree item 2 - 1</zero-tree-item>
              </zero-tree-item>
              <zero-tree-item role="treeitem" class="nested">Tree item 3</zero-tree-item>
            </zero-tree-view>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <zero-progress role="progressbar"></zero-progress>
          </div>
          <div class="column">
            <zero-progress-ring role="progressbar"></zero-progress-ring>
          </div>
        </div>
      </div>
    </div>
`;
