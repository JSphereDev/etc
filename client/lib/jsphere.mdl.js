import { registerComponent, UIView } from './jsphere.js';

registerComponent('button', (component) => {
    
    component.markup(`
        <button data-id="_container" class="mdl-button mdl-js-button">
            <i data-id="_icon" class="" style="font-style:normal;"></i>
        </button>
    `);
    
    component.init((view) => {
        view.state.disabled = false;
        view.state.icon = '';
        view.state.label = '';
        view.state.onclick;
        view.state.style = '';
        view.state.styles = {
            'button': {
                element: 'mdl-button mdl-js-button'
            },
            'button.primary': {
                element: 'mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
            },
            'button.secondary': {
                element: 'mdl-button mdl-js-button mdl-button--raised mdl-button--accent'
            },
            'button.fab.primary': {
                element: 'mdl-button mdl-js-button mdl-button--fab mdl-button--colored'
            },
            'button.fab.secondary': {
                element: 'mdl-button mdl-js-button mdl-button--fab'
            }
        };
        view.defineProperties({
            init: {
                value: (config) => {
                    if (typeof config != 'object') config = {};
                    if (config.onclick !== undefined) view.onclick = config.onclick;
                    if (config.disabled !== undefined) view.disabled = config.disabled;
                    if (config.icon !== undefined) view.icon = config.icon;
                    if (config.label !== undefined) view.label = config.label;
                    if (config.visible !== undefined) view.visible = config.visible;
                    if (config.style !== undefined) view.style = config.style
                }
            },
            click: {
                get: () => {
                    return view.state.onclick;
                }
            },
            disabled: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `disabled: Invalid property value`;
                    if (view.state.disabled === value) return;
                    view.state.disabled = value;
                    view._container.disabled = view.state.disabled;
                },
                get: () => {
                    return view.state.disabled;
                }
            },
            icon: {
                set: (value) => {
                    if (typeof value != 'string') throw `icon: Invalid property value`;
                    if (view.state.icon === value) return;
                    view.state.icon = value;
                    view._icon.classList.add('material-icons');
                    view._icon.innerText = view.state.icon;
                },
                get: () => {
                    return view.state.icon;
                }
            },
            onclick: {
                set: (value) => {
                    if (typeof value != 'function') throw `onclick: Invalid property value`;
                    view._container.removeEventListener('click', view.state.onclick);
                    view.state.onclick = () => { value(); }
                    view._container.addEventListener("click", view.state.onclick);
                },
                get: () => {
                    return view.state.onclick;
                }
            },
            style: {
                set: (value) => {
                    if (typeof value != 'string') throw `style: Invalid property value`;
                    if (view.state.style === value) return;
                    view.state.style = value;
                    const style = view.state.styles[view.state.style]
                    view._container.className = style.element;
                    componentHandler.upgradeElement(view._container);
                },
                get: () => {
                    return view.state.style;
                }            
            },
            text: {
                set: (value) => {
                    if (typeof value != 'string') throw `text: Invalid property value`;
                    if (view.state.label === value) return;
                    view.state.label = value;
                    view._icon.classList.remove('material-icons');
                    view._icon.innerText = view.state.label;
                },
                get: () => {
                    return view.state.label;
                }
            },
        });
        view.style = 'button';
    });

    return component;
});


registerComponent('checkbox', (component) => {
    
    component.markup(`
        <label data-id="_container" class="mdl-checkbox mdl-js-checkbox">
            <input data-id="_checkbox" class="mdl-checkbox__input" type="checkbox">
            <span data-id="_label" class="mdl-checkbox__label"></span>
        </label>
    `);
    
    component.init((view) => {
        view.state.checked = false;
        view.state.disabled = false;
        view.state.label = '';
        view.state.onchange;
        view.state.style = '';
        view.state.styles = {
            'checkbox': {
                element: 'mdl-checkbox mdl-js-checkbox',
                input: 'mdl-checkbox__input',
                span: 'mdl-checkbox__label'
            },
            'checkbox.icon': {
                element: 'mdl-icon-toggle mdl-js-icon-toggle',
                input: 'mdl-icon-toggle__input',
                span: 'mdl-icon-toggle__label material-icons'
            },
            'checkbox.switch': {
                element: 'mdl-switch mdl-js-switch',
                input: 'mdl-switch__input',
                span: 'mdl-switch__label'
            }
        };
        view.defineProperties({
            init: {
                value: (config) => {
                    if (typeof config != 'object') config = {};
                    if (config.icon !== undefined) view.icon = config.icon;
                    if (config.label !== undefined) view.label = config.label;
                    if (config.onchange !== undefined) view.onchange = config.onchange;
                    if (config.checked !== undefined) view.checked = config.checked;
                    if (config.disabled !== undefined) view.disabled = config.disabled;
                    if (config.visible !== undefined) view.visible = config.visible;
                    if (config.style !== undefined) view.style = config.style
                }
            },
            checked: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `checked: Invalid property value`;
                    if (view.state.checked === value) return;
                    view.state.checked = !value; // done because the onchange routine will switch the state back to the opposite
                    view.state.onchange();
                },
                get: () => {
                    return view.state.checked;
                }
            },
            disabled: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `disabled: Invalid property value`;
                    if (view.state.disabled === value) return;
                    view.state.disabled = value;
                    view._checkbox.disabled = view.state.disabled;
                },
                get: () => {
                    return view.state.disabled;
                }
            },
            label: {
                set: (value) => {
                    if (typeof value != 'string') throw `label: Invalid property value`;
                    if (view.state.label === value) return;
                    view.state.label = value;
                    view._label.innerText = view.state.label;
                },
                get: () => {
                    return view.state.label;
                }
            },
            onchange: {
                set: (value) => {
                    if (typeof value != 'function') throw `onchange: Invalid property value`;
                    view._checkbox.removeEventListener('change', view.state.onchange);
                    view.state.onchange = () => { 
                        view.state.checked = !view.state.checked;
                        if (view.state.checked) view._container.classList.add('is-checked');
                        else view._container.classList.remove('is-checked');    
                        value(); };
                    view._checkbox.addEventListener("change", view.state.onchange);
                }
            },
            style: {
                set: (value) => {
                    if (typeof value != 'string') throw `style: Invalid property value`;
                    if (view.state.style === value) return;
                    view.state.style = value;
                    const style = view.state.styles[view.state.style]
                    view._container.className = style.element;
                    view._checkbox.className = style.input;
                    view._label.className = style.span;
                    componentHandler.upgradeElement(view._container);
                },
                get: () => {
                    return view.state.style;
                }            
            }
        });
        view.style = 'checkbox';
        view.onchange = () => {};
    });

    return component;
});


registerComponent('radio', (component) => {
    
    component.markup(`
        <label data-id="_container" class="mdl-radio mdl-js-radio">
            <input data-id="_radio" class="mdl-radio__input" type="radio">
            <span data-id="_label" class="mdl-radio__label"></span>
        </label>
    `);
    
    component.init((view) => {
        view.state.checked = false;
        view.state.disabled = false;
        view.state.label = '';
        view.state.onclick;
        view.state.style = '';
        view.state.styles = {
            'radio': {
                element: 'mdl-radio mdl-js-radio',
                input: 'mdl-radio__button',
                span: 'mdl-radio__label'
            }
        };
        view.state.value = '';
        view.defineProperties({
            init: {
                value: (config) => {
                    if (typeof config != 'object') config = {};
                    if (config.name !== undefined) view.name = config.name;
                    if (config.label !== undefined) view.label = config.label;
                    if (config.value !== undefined) view.value = config.value;
                    if (config.onclick !== undefined) view.onclick = config.onclick;
                    if (config.checked !== undefined) view.checked = config.checked;
                    if (config.disabled !== undefined) view.disabled = config.disabled;
                    if (config.visible !== undefined) view.visible = config.visible;
                    if (config.style !== undefined) view.style = config.style
                }
            },
            checked: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `checked: Invalid property value`;
                    if (view.state.checked === value) return;
                    view.state.checked = value;
                    view._radio.checked = view.state.checked;
                    view.state.onclick();
                },
                get: () => {
                    return view.state.checked;
                }
            },
            click: {
                get: () => {
                    return view.state.onclick;
                }
            },
            disabled: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `disabled: Invalid property value`;
                    if (view.state.disabled === value) return;
                    view.state.disabled = value;
                    view._radio.disabled = view.state.disabled;
                },
                get: () => {
                    return view.state.disabled;
                }
            },
            label: {
                set: (value) => {
                    if (typeof value != 'string') throw `label: Invalid property value`;
                    if (view.state.label === value) return;
                    view.state.label = value;
                    view._label.innerText = view.state.label;
                },
                get: () => {
                    return view.state.label;
                }
            },
            name: {
                set: (value) => {
                    if (typeof value != 'string') throw `name: Invalid property value`;
                    if (view.state.name === value) return;
                    view.state.name = value;
                    view._radio.name = view.state.name;
                },
                get: () => {
                    return view.state.name;
                }
            },
            onclick: {
                set: (value) => {
                    if (typeof value != 'function') throw `onclick: Invalid property value`;
                    view._radio.removeEventListener('change', view.state.onclick);
                    view.state.onclick = () => { value(); };
                    view._radio.addEventListener("change", view.state.onclick);
                }
            },
            style: {
                set: (value) => {
                    if (typeof value != 'string') throw `style: Invalid property value`;
                    if (view.state.style === value) return;
                    view.state.style = value;
                    const style = view.state.styles[view.state.style]
                    view._container.className = style.element;
                    view._radio.className = style.input;
                    view._label.className = style.span;
                    componentHandler.upgradeElement(view._container);
                },
                get: () => {
                    return view.state.style;
                }            
            },
            value: {
                set: (value) => {
                    if (typeof value != 'string' && typeof value != 'number') throw `value: Invalid property value`;
                    if (view.state.value === value) return;
                    view.state.value = value;
                    view._radio.value = view.state.value;
                },
                get: () => {
                    return view.state.value;
                }
            }
        });
        view.style = 'radio';
    });

    return component;
});


registerComponent('repeater', (component) => {
    
    component.markup(``);
    
    component.init((view) => {
        view.state.template = component.querySelector("template").content.firstElementChild;
        view.defineProperties({
            init: {
                value: (config) => {
                    if (config.visible !== undefined) view.visible = config.visible;
                }
            },
            add: {
                value: (id) => {
                    const item = view.state.template.cloneNode(true);
                    item.setAttribute("data-id", `view:${id}`);
                    component.appendChild(item);
                    view[id] = item.view = new UIView(item);
                    return item.view;            
                }
            },
            removeAll: {
                value: () => {
                    component.innerHTML = '';
                }
            }
        });
    });

    return component;
});


registerComponent('select', (component) => {
    
    component.markup(`
        <div data-id="_container" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height">
            <input data-id="_input" class="mdl-textfield__input" type="text">
            <input data-id="_hidden" type="hidden">
            <i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
            <label data-id="_label" class="mdl-textfield__label"></label>
            <span data-id="_message" class="mdl-textfield__error" style="display:none"></span>
            <ul data-id="_list" class="mdl-menu mdl-menu--bottom-left mdl-js-menu"></ul>
        </div>
    `);
    
    component.init((view) => {
        view.state.disabled = false;
        view.state.invalid = false;
        view.state.label = '';
        view.state.map = { value: 'value', text: 'text' };
        view.state.message = '';
        view.state.onchange;
        view.state.options = [];
        view.state.style = '';
        view.state.styles = {
            'select': {
                element: 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height',
                input: 'mdl-textfield__input',
                label: 'mdl-textfield__label',
                ul: 'mdl-menu mdl-menu--bottom-left mdl-js-menu',
                span: 'mdl-textfield__error'
            }
        };
        view.state.value = '';
        view.defineProperties({
            init: {
                value: (config) => {
                    if (typeof config != 'object') config = {};
                    if (config.label !== undefined) view.label = config.label;
                    if (config.map !== undefined) view.map = config.map;
                    if (config.options !== undefined) view.options = config.options;
                    if (config.invalid !== undefined) view.invalid = config.invalid;
                    if (config.message !== undefined) view.message = config.message;
                    if (config.onchange !== undefined) view.onchange = config.onchange;
                    if (config.value !== undefined) view.value = config.value;
                    if (config.disabled !== undefined) view.disabled = config.disabled;
                    if (config.visible !== undefined) view.visible = config.visible;
                    if (config.style !== undefined) view.style = config.style
                }
            },
            disabled: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `disabled: Invalid property value`;
                    if (view.state.disabled === value) return;
                    view.state.disabled = value;
                    view._input.disabled = view.state.disabled;
                },
                get: () => {
                    return view.state.disabled;
                }
            },
            focus: {
                value: () => { view._input.focus(); }
            },
            invalid: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `invalid: Invalid property value`;
                    if (view.state.invalid === value) return;
                    view.state.invalid = value;
                    if (view.state.invalid) view._container.classList.add('is-invalid');
                    else view._container.classList.remove('is-invalid');
                },
                get: () => {
                    return view.state.invalid;
                }
            },
            label: {
                set: (value) => {
                    if (typeof value != 'string') throw `label: Invalid property value`;
                    if (view.state.label === value) return;
                    view.state.label = value;
                    view._label.innerText = view.state.label;
                },
                get: () => {
                    return view.state.label;
                }
            },
            map: {
                set: (value) => {
                    if (typeof value != 'object') throw `map: Invalid property value`;
                    view.state.map = value;
                },
                get: () => {
                    return view.state.map;
                }
            },
            message: {
                set: (value) => {
                    if (typeof value != 'string') throw `message: Invalid property value`;
                    if (view.state.message === value) return;
                    view.state.message = value;
                    if (view.state.message === '') view._message.style.display = 'none';
                        else view._message.style.display = '';
                    view._message.innerText = view.state.message;
                },
                get: () => {
                    return view.state.message;
                }        
            },
            onchange: {
                set: (value) => {
                    if (typeof value != 'function') throw `onchange: Invalid property value`;
                    view.state.onchange = value;
                }
            },
            options: {
                set: (value) => {
                    if (!Array.isArray(value)) throw `options: Invalid property value`;
                    view.state.options = value;
                    view._list.innerHTML = '';
                    for (let i = 0; i < view.state.options.length; i++) {
                        const option = view.state.options[i];
                        const value = (option[view.state.map.value] !== undefined) ? option[view.state.map.value] : i;
                        const listItem = document.createElement('li');
                        listItem.className = 'mdl-menu__item';
                        if (value === view.state.value) listItem.setAttribute('data-selected', 'true');
                        listItem.setAttribute('data-val', value);
                        listItem.innerText = option[view.state.map.text];
                        view._list.appendChild(listItem);
                    }
                    getmdlSelect.init('.getmdl-select');
                },
                get: () => {
                    return view.state.message;
                }        
            },
            style: {
                set: (value) => {
                    if (typeof value != 'string') throw `style: Invalid property value`;
                    if (view.state.style === value) return;
                    view.state.style = value;
                    const style = view.state.styles[view.state.style]
                    view._container.className = style.element;
                    view._input.className = style.input;
                    view._label.className = style.label;
                    view._message.className = style.span;
                    view._list.className = style.ul;
                    getmdlSelect.init('.getmdl-select');
                            },
                get: () => {
                    return view.state.style;
                }            
            },
            value: {
                set: (value) => {
                    if (typeof value != 'string' && typeof value != 'number') throw `value: Invalid property value`;
                    if (view.state.value === value) return;
                    view.state.value = value;
                    let itemFound = false;
                    for (const option of view.state.options) {
                        if (option[view.state.map.value] == view.state.value) {
                            view._input.value = option[view.state.map.text];
                            view._hidden.value = view.state.value;
                            if (view.state.value != '') view._container.classList.add('is-dirty')
                            else view._container.classList.remove('is-dirty')
                            if (typeof(view.state.onchange) === 'function') view.state.onchange();
                            itemFound = true;
                            break;
                        }
                    }
                    if (!itemFound) {
                        view._input.value = '';
                        view._hidden.value = '';
                    }
                },
                get: () => {
                    return view.state.value;
                }
            }
        });
        view._input.addEventListener('change', (e) => {
            if (view.state.value === view._hidden.value) return;
            view.state.value = view._hidden.value;
            view.state.invalid = false;
            if (typeof view.state.onchange == 'function') setTimeout(() => { view.state.onchange(e); }, 250);
        });
        view.style = 'select';
    });

    return component;
});


registerComponent('text', (component) => {
    
    component.markup(`
        <div data-id="_container" style="height: 100%; width: 100%"></div>
    `);
    
    component.init((view) => {
        view.state.onclick;
        view.state.value = '';
        view.defineProperties({
            init: {
                value: (config) => {
                    if (typeof config != 'object') config = {};
                    if (config.onclick !== undefined) view.onclick = config.onclick;
                    if (config.value !== undefined) view.value = config.value;
                    if (config.visible !== undefined) view.visible = config.visible;
                }
            },
            click: {
                get: () => {
                    return view.state.onclick;
                }
            },
            onclick: {
                set: (value) => {
                    if (typeof value != 'function') throw `onclick: Invalid property value`;
                    view._container.removeEventListener('click', view.state.onclick);
                    view.state.onclick = () => { value() };
                    view._container.addEventListener("click", view.state.onclick);
                },
                get: () => {
                    return view.state.onclick;
                }
            },
            value: {
                set: (value) => {
                    if (typeof value != 'string' && typeof value != 'number') throw `value: Invalid property value`;
                    if (view.state.value === value) return;
                    view.state.value = value;
                    view._container.innerText = view.state.value;
                },
                get: () => {
                    return view.state.value;
                }            
            }
        });
    });

    return component;
});


registerComponent('textarea', (component) => {
    
    component.markup(`
        <div data-id="_container" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <textarea data-id="_input" type="text" class="mdl-textfield__input"></textarea>
            <label data-id="_label" class="mdl-textfield__label"></label>
            <span data-id="_message" class="mdl-textfield__error" style="display:none"></span>
        </div>
    `);
    
    component.init((view) => {
        view.state.disabled = false;
        view.state.invalid = false;
        view.state.label = '';
        view.state.message = '';
        view.state.onchange;
        view.state.readonly = false;
        view.state.rows;
        view.state.style = '';
        view.state.styles = {
            'textarea': {
                element: 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label',
                input: 'mdl-textfield__input',
                label: 'mdl-textfield__label',
                span: 'mdl-textfield__error'
            }
        }
        view.state.value = '';
        view.defineProperties({
            init: {
                value: (config) => {
                    if (typeof config != 'object') config = {};
                    if (config.label !== undefined) view.label = config.label;
                    if (config.rows !== undefined) view.rows = config.rows;
                    if (config.invalid !== undefined) view.invalid = config.invalid;
                    if (config.message !== undefined) view.message = config.message;
                    if (config.onchange !== undefined) view.onchange = config.onchange;
                    if (config.value !== undefined) view.value = config.value;
                    if (config.readonly !== undefined) view.readonly = config.readonly;
                    if (config.disabled !== undefined) view.disabled = config.disabled;
                    if (config.visible !== undefined) view.visible = config.visible;
                    if (config.style !== undefined) view.style = config.style
                }
            },
            disabled: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `disabled: Invalid property value`;
                    if (view.state.disabled === value) return;
                    view.state.disabled = value;
                    view._input.disabled = view.state.disabled;
                },
                get: () => {
                    return view.state.disabled;
                }
            },
            focus: {
                value: () => { view._input.focus(); }
            },
            invalid: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `invalid: Invalid property value`;
                    if (view.state.invalid === value) return;
                    view.state.invalid = value;
                    if (view.state.invalid) view._container.classList.add('is-invalid');
                    else view._container.classList.remove('is-invalid');
                },
                get: () => {
                    return view.state.invalid;
                }
            },
            label: {
                set: (value) => {
                    if (typeof value != 'string') throw `label: Invalid property value`;
                    if (view.state.label === value) return;
                    view.state.label = value;
                    view._label.innerText = view.state.label;
                },
                get: () => {
                    return view.state.label;
                }  
            },
            message: {
                set: (value) => {
                    if (typeof value != 'string') throw `message: Invalid property value`;
                    if (view.state.message === value) return;
                    view.state.message = value;
                    if (view.state.message === '') view._message.style.display = 'none';
                        else view._message.style.display = '';
                    view._message.innerText = view.state.message;
                },
                get: () => {
                    return view.state.message;
                }        
            },
            onchange: {
                set: (value) => {
                    if (typeof value != 'function') throw `onchange: Invalid property value`;
                    view.state.onchange = value;
                }            
            },
            readonly: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `readonly: Invalid property value`;
                    if (view.state.readonly === value) return;
                    view.state.readonly = value;
                    if (view.state.readonly) view._input.setAttribute('readonly', true);
                    else view._input.removeAttribute('readonly');
                },
                get: () => {
                    return view.state.readonly;
                }
            },
            rows: {
                set: (value) => {
                    if (typeof value != 'number') throw `rows: Invalid property value`;
                    if (view.state.rows === value) return;
                    view.state.rows = value;
                    view._input.rows = view.state.rows;
                },
                get: () => {
                    return view.state.rows;
                }
            },
            style: {
                set: (value) => {
                    if (typeof value != 'string') throw `style: Invalid property value`;
                    if (view.state.style === value) return;
                    view.state.style = value;
                    const style = view.state.styles[view.state.style]
                    view._container.className = style.element;
                    view._input.className = style.input;
                    view._label.className = style.label;
                    view._message.className = style.span;
                    componentHandler.upgradeElement(view._container);
                },
                get: () => {
                    return view.state.style;
                }            
            },
            value: {
                set: (value) => {
                    if (typeof value != 'string' && typeof value != 'number') throw `value: Invalid property value`;
                    if (view.state.value === value) return;
                    view.state.value = value;
                    view._input.value = view.state.value;
                    if (view.state.value != '') view._container.classList.add('is-dirty')
                    else view._container.classList.remove('is-dirty')
                    if (typeof view.state.onchange == 'function') view.state.onchange();
                },
                get: () => {
                    return view.state.value;
                }            
            }
        });
        view._input.addEventListener('keyup', () => {
            if (!view.state.disabled && !view.state.readonly) {
                view.state.value = view._input.value;
                view.state.invalid = false;
                if (typeof view.state.onchange == 'function') view.state.onchange();
            }
        });
        view.style = 'textarea';
    });

    return component;
})


registerComponent('textbox', (component) => {
    
    component.markup(`
        <div data-id="_container" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input data-id="_input" type="text" class="mdl-textfield__input">
            <label data-id="_label" class="mdl-textfield__label"></label>
            <span data-id="_message" class="mdl-textfield__error" style="display:none"></span>
        </div>
    `);
    
    component.init((view) => {
        view.state.disabled = false;
        view.state.invalid = false;
        view.state.label = '';
        view.state.message = '';
        view.state.onchange;
        view.state.readonly = false;
        view.state.style = '';
        view.state.styles = {
            'textbox': {
                element: 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label',
                input: 'mdl-textfield__input',
                label: 'mdl-textfield__label',
                span: 'mdl-textfield__error'
            }
        }
        view.state.value = '';
        view.defineProperties({
            init: {
                value: (config) => {
                    if (typeof config != 'object') config = {};
                    if (config.label !== undefined) view.label = config.label;
                    if (config.invalid !== undefined) view.invalid = config.invalid;
                    if (config.message !== undefined) view.message = config.message;
                    if (config.onchange !== undefined) view.onchange = config.onchange;
                    if (config.value !== undefined) view.value = config.value;
                    if (config.readonly !== undefined) view.readonly = config.readonly;
                    if (config.disabled !== undefined) view.disabled = config.disabled;
                    if (config.visible !== undefined) view.visible = config.visible;
                    if (config.style !== undefined) view.style = config.style
                }
            },
            disabled: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `disabled: Invalid property value`;
                    if (view.state.disabled === value) return;
                    view.state.disabled = value;
                    view._input.disabled = view.state.disabled;
                },
                get: () => {
                    return view.state.disabled;
                }
            },
            focus: {
                value: () => { view._input.focus(); }
            },
            invalid: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `invalid: Invalid property value`;
                    if (view.state.invalid === value) return;
                    view.state.invalid = value;
                    if (view.state.invalid) view._container.classList.add('is-invalid');
                    else view._container.classList.remove('is-invalid');
                },
                get: () => {
                    return view.state.invalid;
                }
            },
            label: {
                set: (value) => {
                    if (typeof value != 'string') throw `label: Invalid property value`;
                    if (view.state.label === value) return;
                    view.state.label = value;
                    view._label.innerText = view.state.label;
                },
                get: () => {
                    return view.state.label;
                }  
            },
            message: {
                set: (value) => {
                    if (typeof value != 'string') throw `message: Invalid property value`;
                    if (view.state.message === value) return;
                    view.state.message = value;
                    if (view.state.message === '') view._message.style.display = 'none';
                        else view._message.style.display = '';
                    view._message.innerText = view.state.message;
                },
                get: () => {
                    return view.state.message;
                }        
            },
            onchange: {
                set: (value) => {
                    if (typeof value != 'function') throw `onchange: Invalid property value`;
                    view.state.onchange = value;
                }            
            },
            readonly: {
                set: (value) => {
                    if (typeof value != 'boolean') throw `readonly: Invalid property value`;
                    if (view.state.readonly === value) return;
                    view.state.readonly = value;
                    if (view.state.readonly) view._input.setAttribute('readonly', true);
                    else view._input.removeAttribute('readonly');
                },
                get: () => {
                    return view.state.readonly;
                }
            },
            style: {
                set: (value) => {
                    if (typeof value != 'string') throw `style: Invalid property value`;
                    if (view.state.style === value) return;
                    view.state.style = value;
                    const style = view.state.styles[view.state.style]
                    view._container.className = style.element;
                    view._input.className = style.input;
                    view._label.className = style.label;
                    view._message.className = style.span;
                    componentHandler.upgradeElement(view._container);
                },
                get: () => {
                    return view.state.style;
                }            
            },
            value: {
                set: (value) => {
                    if (typeof value != 'string' && typeof value != 'number') throw `value: Invalid property value`;
                    if (view.state.value === value) return;
                    view.state.value = value;
                    view._input.value = view.state.value;
                    if (view.state.value != '') view._container.classList.add('is-dirty')
                    else view._container.classList.remove('is-dirty')
                    if (typeof view.state.onchange == 'function') view.state.onchange();
                },
                get: () => {
                    return view.state.value;
                }            
            }
        });
        view._input.addEventListener('keyup', () => {
            if (!view.state.disabled && !view.state.readonly) {
                view.state.value = view._input.value;
                view.state.invalid = false;
                if (typeof view.state.onchange == 'function') view.state.onchange();
            }
        });
        view.style = 'textbox';
    });

    return component;
})

// GETMDL-SELECT UTILITY CODE
{
    'use strict';
    (function () {
        function whenLoaded() {
            getmdlSelect.init('.getmdl-select');
        };

        window.addEventListener ?
            window.addEventListener("load", whenLoaded, false) :
            window.attachEvent && window.attachEvent("onload", whenLoaded);

    }());

    var getmdlSelect = {
        _addEventListeners: function (dropdown) {
            var input = dropdown.querySelector('input');
            var hiddenInput = dropdown.querySelector('input[type="hidden"]');
            var list = dropdown.querySelectorAll('li');
            var menu = dropdown.querySelector('.mdl-js-menu');
            var arrow = dropdown.querySelector('.mdl-icon-toggle__label');
            var label = '';
            // var previousValue = '';
            // var previousDataVal = '';
            // Add by YM on 2022/03/04 @ 3:59PM
            var previousValue = input.value;
            var previousDataVal = hiddenInput.value;
            var opened = false;

            var setSelectedItem = function (li) {
                var value = li.textContent.trim();
                input.value = value;
                list.forEach(function (li) {
                    li.classList.remove('selected');
                });
                li.classList.add('selected');
                dropdown.MaterialTextfield.change(value); // handles css class changes
                setTimeout(function () {
                    dropdown.MaterialTextfield.updateClasses_(); //update css class
                }, 250);

                // update input with the "id" value
                hiddenInput.value = li.dataset.val || '';

                previousValue = input.value;
                previousDataVal = hiddenInput.value;

                if ("createEvent" in document) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    menu['MaterialMenu'].hide();
                    input.dispatchEvent(evt);
                } else {
                    input.fireEvent("onchange");
                }
            }

            var hideAllMenus = function () {
                opened = false;
                input.value = previousValue;
                hiddenInput.value = previousDataVal;
                if (!dropdown.querySelector('.mdl-menu__container').classList.contains('is-visible')) {
                    dropdown.classList.remove('is-focused');
                }
                var menus = document.querySelectorAll('.getmdl-select .mdl-js-menu');
                [].forEach.call(menus, function (menu) {
                    menu['MaterialMenu'].hide();
                });
                var event = new Event('closeSelect');
                menu.dispatchEvent(event);
            };
            document.body.addEventListener('click', hideAllMenus, false);

            //hide previous select after press TAB
            dropdown.onkeydown = function (event) {
                if (event.keyCode == 9) {
                    input.value = previousValue;
                    hiddenInput.value = previousDataVal;
                    menu['MaterialMenu'].hide();
                    dropdown.classList.remove('is-focused');
                }
            };

            //show select if it have focus
            input.onfocus = function (e) {
                menu['MaterialMenu'].show();
                menu.focus();
                opened = true;
            };

            input.onblur = function (e) {
                e.stopPropagation();
            };

            //hide all old opened selects and opening just clicked select
            input.onclick = function (e) {
                e.stopPropagation();
                if (!menu.classList.contains('is-visible')) {
                    menu['MaterialMenu'].show();
                    hideAllMenus();
                    dropdown.classList.add('is-focused');
                    opened = true;
                } else {
                    menu['MaterialMenu'].hide();
                    opened = false;
                }
            };

            input.onkeydown = function (event) {
                if (event.keyCode == 27) {
                    input.value = previousValue;
                    hiddenInput.value = previousDataVal;
                    menu['MaterialMenu'].hide();
                    dropdown.MaterialTextfield.onBlur_();
                    if (label !== '') {
                        dropdown.querySelector('.mdl-textfield__label').textContent = label;
                        label = '';
                    }
                }
            };

            menu.addEventListener('closeSelect', function (e) {
                input.value = previousValue;
                hiddenInput.value = previousDataVal;
                dropdown.classList.remove('is-focused');
                if (label !== '') {
                    dropdown.querySelector('.mdl-textfield__label').textContent = label;
                    label = '';
                }
            });

            //set previous value and data-val if ESC was pressed
            menu.onkeydown = function (event) {
                if (event.keyCode == 27) {
                    input.value = previousValue;
                    hiddenInput.value = previousDataVal;
                    dropdown.classList.remove('is-focused');
                    if (label !== '') {
                        dropdown.querySelector('.mdl-textfield__label').textContent = label;
                        label = '';
                    }
                }
            };

            if (arrow) {
                arrow.onclick = function (e) {
                    e.stopPropagation();
                    if (opened) {
                        menu['MaterialMenu'].hide();
                        opened = false;
                        dropdown.classList.remove('is-focused');
                        dropdown.MaterialTextfield.onBlur_();
                        input.value = previousValue;
                        hiddenInput.value = previousDataVal;
                    } else {
                        hideAllMenus();
                        dropdown.MaterialTextfield.onFocus_();
                        input.focus();
                        menu['MaterialMenu'].show();
                        opened = true;
                    }
                };
            }

            [].forEach.call(list, function (li) {
                li.onfocus = function () {
                    dropdown.classList.add('is-focused');
                    var value = li.textContent.trim();
                    input.value = value;
                    if (!dropdown.classList.contains('mdl-textfield--floating-label') && label == '') {
                        label = dropdown.querySelector('.mdl-textfield__label').textContent.trim();
                        dropdown.querySelector('.mdl-textfield__label').textContent = '';
                    }
                };

                li.onclick = function () {
                    setSelectedItem(li);
                };

                if (li.dataset.selected) {
                    setSelectedItem(li);
                }
            });
        },
        init: function (selector) {
            var dropdowns = document.querySelectorAll(selector);
            [].forEach.call(dropdowns, function (dropdown) {
                getmdlSelect._addEventListeners(dropdown);
                componentHandler.upgradeElement(dropdown);
                componentHandler.upgradeElement(dropdown.querySelector('ul'));
            });
        }
    };
}
