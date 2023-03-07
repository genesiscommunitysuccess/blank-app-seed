import { html } from '@microsoft/fast-element';
import type { Home } from './home';

export const HomeTemplate = html<Home>`
<div class="wrapper">
      <div class="column">
        <div class="row">
          <div class="column">
            <alpha-breadcrumb role="navigation">
              <alpha-breadcrumb-item href="#">Item 1</alpha-breadcrumb-item>
              <alpha-breadcrumb-item href="#">Item 2</alpha-breadcrumb-item>
              <alpha-breadcrumb-item>Item 3</alpha-breadcrumb-item>
            </alpha-breadcrumb>
          </div>
          <div class="column">
            <alpha-button href="#" appearance="accent">Button</alpha-button>
            <alpha-button href="#" appearance="neutral">Button</alpha-button>
            <alpha-button href="#" appearance="outline">Button</alpha-button>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <alpha-radio-group role="radiogroup" orientation="horizontal">
              <alpha-radio
                checked
                role="radio"
                aria-checked="true"
                aria-required="false"
                aria-disabled="false"
                tabindex="0"
              >
                Radio 1
              </alpha-radio>
              <alpha-radio
                role="radio"
                aria-checked="false"
                aria-required="false"
                aria-disabled="false"
                tabindex="-1"
              >
                Radio 2
              </alpha-radio>
            </alpha-radio-group>
          </div>
          <div class="column">
            <alpha-checkbox
              role="checkbox"
              checked
              aria-checked="true"
              aria-required="false"
              aria-disabled="false"
              tabindex="0"
            >
              Checkbox
            </alpha-checkbox>
            <alpha-checkbox
              role="checkbox"
              aria-checked="false"
              aria-required="false"
              aria-disabled="false"
              tabindex="0"
            >
              Checkbox
            </alpha-checkbox>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <alpha-text-field
              placeholder="Text field"
              aria-label="Example text field"
              type="text"
            ></alpha-text-field>
          </div>
          <div class="column">
            <alpha-flipper
              role="button"
              tabindex="-1"
              class="previous"
              aria-hidden="true"
              direction="previous"
            ></alpha-flipper>
            <alpha-flipper
              role="button"
              tabindex="-1"
              class="next"
              aria-hidden="true"
              direction="next"
            ></alpha-flipper>
            <alpha-switch
              role="switch"
              checked
              aria-checked="true"
              aria-disabled="false"
              tabindex="0"
            ></alpha-switch>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <alpha-slider
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
            ></alpha-slider>
          </div>
          <div class="column">
            <alpha-combobox autocomplete="both">
              <alpha-option>Christopher Eccleston</alpha-option>
              <alpha-option>David Tenant</alpha-option>
              <alpha-option>Matt Smith</alpha-option>
              <alpha-option>Peter Capaldi</alpha-option>
              <alpha-option>Jodie Whittaker</alpha-option>
            </alpha-combobox>
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
            <alpha-tree-view role="tree">
              <alpha-tree-item
                role="treeitem"
                tabindex="0"
                aria-expanded="true"
                expanded
                selected
                class="nested"
              >
                Tree item 1
                <alpha-tree-item slot="item" role="treeitem">Tree item 1 - 1</alpha-tree-item>
              </alpha-tree-item>
              <alpha-tree-item role="treeitem" tabindex="0" aria-expanded="false" class="nested">
                Tree item 2
                <alpha-tree-item slot="item" role="treeitem">Tree item 2 - 1</alpha-tree-item>
              </alpha-tree-item>
              <alpha-tree-item role="treeitem" class="nested">Tree item 3</alpha-tree-item>
            </alpha-tree-view>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <alpha-progress role="progressbar"></alpha-progress>
          </div>
          <div class="column">
            <alpha-progress-ring role="progressbar"></alpha-progress-ring>
          </div>
        </div>
      </div>
    </div>
`;
