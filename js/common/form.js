
function createInputFormEntry(entry) {
    const elt = document.createElement('div');
    elt.classList.add('form_entry');

    if (entry.label) {
        const label = document.createElement('div');
        label.classList.add('form_entry_label');
        label.appendChild(createTextSpan(entry.label));
        elt.appendChild(label);
    }
    
    const input = document.createElement('input');
    input.classList.add('form_entry_input');
    input.type = entry.type;
    input.name = entry.id || entry.label.toLowerCase();
    input.tabIndex = 0;
    if (entry.default) {
        input.value = entry.default;
    }
    if (entry.autofocus) {
        const observer = new MutationObserver((mutations) => {
            input.focus();
            observer.disconnect();
        });
        observer.observe(elt, { childList: true });
    }

    elt.append(input);
    return elt;
}

function createTextFormEntry(entry) {
    const elt = document.createElement('div');
    elt.classList.add('form_entry');

    elt.appendChild(createTextSpan(entry.text));

    return elt;
}


function createFormEntry(entry) {
    if (entry.type) {
        return createInputFormEntry(entry);
    } else if (entry.text) {
        return createTextFormEntry(entry);
    }
}

function createForm(opts) {
    const form = document.createElement('div');
    form.classList.add('form');

    form.tabIndex = -1;

    opts.rows.forEach((row) => {
        const elt = document.createElement('div');
        elt.classList.add('form_row');

        row.forEach((entry) => {
            elt.appendChild(createFormEntry(entry));
        });

        form.appendChild(elt);
    });

    const submitRow = document.createElement('div');
    submitRow.classList.add('form_row');
    
    const submitButton = document.createElement('div');
    submitButton.classList.add('form_submit_button');
    submitButton.appendChild(createTextSpan(opts.buttonText || i18n('default_form_submit_button')));
    submitButton.tabIndex = 0;

    submitRow.appendChild(submitButton);
    form.appendChild(submitRow);

    function submitForm() {
        const data = {};

        form.querySelectorAll('input').forEach((input) => {
            let value = input.value;

            if (input.type === 'number') {
                value = parseFloat(value);
            }

            data[input.name] = value;
        });

        if (opts.onsubmit) {
            const invalid = opts.onsubmit(data);
            console.log(invalid);
            if (invalid && invalid.length) {
                form.querySelectorAll('input').forEach((input) => {
                    if (invalid.indexOf(input.name) >= 0) {
                        input.classList.add('invalid'); 
                    } else {
                        input.classList.remove('invalid');
                    }
                });
            }
        }
    }

    submitButton.addEventListener('click', () => {
        submitForm();
    });

    form.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            submitForm();
        } else if (opts.onclose && e.keyCode === 27) {
            opts.onclose();
        }
    });

    return form;
}

function spawnFormDialog(opts) {
    const onsubmit = opts.onsubmit;

    opts.onsubmit = (data) => {
        const result = onsubmit(data);

        if (!result) {
            closePopup(popup);
        } else {
            return result;
        }
    }

    opts.onclose = () => {
        closePopup(popup);
    }

    const form = createForm(opts);

    if (opts.mutate) {
        opts.mutate(form);
    }

    const popup = spawnPopup(form, { title: opts.title });
}