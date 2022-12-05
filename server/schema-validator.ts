export interface SchemaEntry {
    name: string,
    required: boolean,
    type: string,
    default?: string|number|boolean|Array<string>,
    range?: Array<string|number>|Record<string,unknown>,
    tags?: Array<string>,
    constraints?: Array<(obj:Record<string,unknown>) => boolean|string>,
    value?: string|number|boolean|Array<Record<string,unknown>>|undefined|null|unknown
}

export function validateObject(schema: Array<SchemaEntry>, obj: Record<string,unknown>, tags: Array<string>) {
    let errors:Record<string,unknown>|null = null;
    for (const field of schema) {
        try {
            // Check tags
            if (field.tags && tags) {
                const items = tags.filter(tag => field.tags?.includes(tag));
                if (items.length < tags.length) continue;
            }

            // Set field value
            field.value = obj[field.name];
            if (field.value == null || typeof field.value == undefined) obj[field.name] = field.value = (typeof field.default == 'boolean' ? field.default : (field.default || null));

            // Assert required field
            if (field.required) {
                assert(field.value != undefined && field.value != null && field.value !== '', 'Required');
            }
            else if (field.value == null || field.value == undefined) {
                continue;
            }

            // Assert field constraints
            if (field.type == 'array') {
                assert(Array.isArray(field.value), 'ArrayTypeRequired');
                const range = field.range as Record<string,number>;
                const value = field.value as Array<Record<string,unknown>>;
                if (range && range.min) assert(value.length >= range.min, `ArrayMinRequired.${range.min}`);
                if (range && range.max) assert(value.length <= range.max, `ArrayMaxExceeded.${range.max}`);
            }
            else if (field.type == 'boolean') {
                assert(typeof field.value == 'boolean', 'BooleanRequired');
            }
            else if (field.type == 'date') {
                const value = field.value as string;
                const regEx = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
                const found = value.match(regEx);
                assert(found != null, 'DateRequired.YYYY-MM-DD');
                const range = field.range as Record<string,string>;
                if (range && range.min) assert(value >= range.min, `DateMinExceeded.${range.min}`);
                if (range && range.max) assert(value <= range.max, `DateMaxExceeded.${range.max}`);
            }
            else if (field.type == 'dateTime') {
                const value = field.value as string;
                const regEx = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/
                const found = value.match(regEx);
                assert(found != null, 'DateTimeRequired.YYYY-MM-DDThh:mm:ss');
                const range = field.range as Record<string,string>;
                if (range && range.min) assert(value >= range.min, `DateTimeMinExceeded.${range.min}`);
                if (range && range.max) assert(value <= range.max, `DateTimeMaxExceeded.${range.max}`);
            }
            else if (field.type == 'integer') {
                assert(Number.isInteger(field.value), 'IntegerRequired');
                if (Array.isArray(field.range)) {
                    const range = field.range as Array<number>;
                    const value = field.value as number;
                    assert(range.includes(value), `IntegerOutOfRange.[${field.range}]`);
                }
                else {
                    const range = field.range as Record<string,number>;
                    const value = field.value as number;
                    if (range && range.min) assert(value >= range.min, `IntegerMinExceeded.${range.min}`);
                    if (field.range && range.max) assert(value <= range.max, `IntegerMaxExceeded.${range.max}`);
                }
            }
            else if (field.type == 'number') {
                assert(typeof field.value === 'number', 'NumberRequired');
                if (Array.isArray(field.range)) {
                    const range = field.range as Array<number>;
                    const value = field.value as number;
                    assert(range.includes(value), `NumberOutOfRange.[${field.range}]`);
                }
                else {
                    const range = field.range as Record<string,number>;
                    const value = field.value as number;
                    if (range && range.min) assert(value >= range.min, `NumberMinExceeded.${range.min}`);
                    if (field.range && range.max) assert(value <= range.max, `NumberMaxExceeded.${range.max}`);
                }
            }
            else if (field.type === 'email') {
                const value = field.value as string;
                const regEx = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
                const found = value.match(regEx);
                assert(found != null, 'EmailRequired');
            }
            else if (field.type === 'uuid') {
                const value = field.value as string;
                const regEx = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
                const found = value.match(regEx);
                assert(found != null, 'UUIDRequired')
            }
            else if (field.type === 'string') {
                assert(typeof field.value === 'string', 'StringRequired');
                if (Array.isArray(field.range)) {
                    const value = field.value as string;
                    assert(field.range.includes(value), `StringOutOfRange.[${field.range}]`);
                }
                else {
                    const range = field.range as Record<string,number>;
                    const value = field.value as string;
                    if (range && range.min) assert(value.length >= range.min, `StringMinExceeded.${range.min}`);
                    if (range && range.max) assert(value.length <= range.max, `StringMaxExceeded.${range.max}`);
                }
            }

            if (Array.isArray(field.constraints)) {
                for (const constraint of field.constraints) {
                    if (typeof constraint !== 'function') continue;
                    const message = constraint(obj);
                    if (typeof message !== 'boolean') throw message;
                }
            }
        }
        catch (e) {
            if (errors === null) errors = {};
            errors[field.name] = e;
        }
    }

    return errors;
}

function assert(condition: boolean, message: string) {
    if (!condition) throw message;
}
