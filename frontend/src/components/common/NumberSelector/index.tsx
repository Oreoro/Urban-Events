import {ActionIcon, NumberInput, NumberInputHandlers, Select, TextInputProps} from "@mantine/core";
import {useCallback, useEffect, useRef, useState} from "react";
import {UseFormReturnType} from "@mantine/form";
import {IconMinus, IconPlus} from "@tabler/icons-react";
import classes from './NumberSelector.module.scss';
import classNames from "classnames";
import _ from "lodash";

interface NumberSelectorProps extends TextInputProps {
    formInstance: UseFormReturnType<any>;
    fieldName: string,
    min?: number;
    max?: number;
    sharedValues?: SharedValues;
}

export const NumberSelector = ({formInstance, fieldName, min, max, sharedValues}: NumberSelectorProps) => {
    const handlers = useRef<NumberInputHandlers>(null);
    // Get initial value from form, defaulting to 0 for consistency with existing behavior
    const initialValue = _.get(formInstance.values, fieldName) || 0;
    const [value, setValue] = useState<number>(initialValue);

    const minValue = min || 0;
    const maxValue = max || 100;

    const [sharedVals] = useState<SharedValues>(() => {
        const shared = sharedValues ?? new SharedValues(maxValue);
        // Initialize shared values with the current value to prevent conflicts
        if (!sharedValues && initialValue > 0) {
            shared.currentValue = initialValue;
        }
        return shared;
    });

    // Debounce form updates to prevent rapid state changes
    const updateForm = useCallback(
        _.debounce((newValue: number) => {
            formInstance.setFieldValue(fieldName, newValue);
        }, 10),
        [formInstance, fieldName]
    );

    useEffect(() => {
        updateForm(value);
    }, [value, updateForm]);

    useEffect(() => {
        // to handle application promo code after updating the quantity
        const formValue = _.get(formInstance.values, fieldName);
        if (formValue !== undefined && formValue !== value) {
            setValue(formValue);
        }
    }, [formInstance.values, fieldName]);

    const increment = useCallback(() => {
        // Prevent rapid clicking by checking if we're already at max
        if (value >= maxValue || sharedVals.quantityRemaining <= 0) {
            return;
        }

        // Always increment by 1 - remove complex logic that was causing issues
        const actualChange = sharedVals.changeValue(1);
        if (actualChange > 0) {
            setValue(prevValue => prevValue + actualChange);
        }
    }, [value, maxValue, sharedVals]);

    const decrement = useCallback(() => {
        // Prevent decrementing below minimum value
        if (value <= minValue) {
            return;
        }

        // Always decrement by 1 - simple logic
        const actualChange = sharedVals.changeValue(-1);
        if (actualChange < 0) {
            setValue(prevValue => prevValue + actualChange);
        }
    }, [value, minValue, sharedVals]);

    const changeValue = useCallback((newValue: number | string) => {
        // Ensure newValue is within bounds
        const numericValue = typeof newValue === 'number' ? newValue : Number(newValue);
        const clampedValue = Math.max(minValue, Math.min(maxValue, Number.isFinite(numericValue) ? numericValue : 0));
        const difference = clampedValue - value;
        
        if (difference !== 0) {
            const actualChange = sharedVals.changeValue(difference);
            setValue(prevValue => prevValue + actualChange);
        }
    }, [value, minValue, maxValue, sharedVals]);

    return (
        <div className={classNames(classes.wrapper, 'button-input')}>
            <ActionIcon
                size={28}
                onClick={decrement}
                disabled={value <= minValue}
                onMouseDown={(event) => event.preventDefault()}
                className={classes.control}
            >
                <IconMinus size="1rem" stroke={1.5}/>
            </ActionIcon>

            <NumberInput
                mb={0}
                variant="unstyled"
                min={minValue}
                max={maxValue}
                handlersRef={handlers}
                value={value}
                hideControls
                onChange={changeValue}
                classNames={{input: classes.input}}
            />

            <ActionIcon
                size={28}
                onClick={increment}
                disabled={value >= maxValue || sharedVals.quantityRemaining <= 0}
                onMouseDown={(event) => event.preventDefault()}
                className={classes.control}
            >
                <IconPlus size="1rem" stroke={1.5}/>
            </ActionIcon>
        </div>
    );
}

/* todo: create an event setting to choose select over button */
export const NumberSelectorSelect = ({formInstance, fieldName, min, max, className}: NumberSelectorProps) => {
    const [value, setValue] = useState<string>('0');

    const minValue = min || 0;
    const maxValue = max || 100;

    useEffect(() => {
        // Only synchronize with form if the value is within bounds and not 0
        if (value !== '0') {
            formInstance.setFieldValue(fieldName, value);
        }
    }, [value, formInstance, fieldName]);

    let data = Array.from({length: maxValue - minValue + 1}, (_, i) => ({
        label: String(minValue + i),
        value: String(minValue + i),
    }));

    if (minValue > 0) {
        data = [{label: '0', value: '0'}, ...data];
    }

    return (
        <div className={classNames(classes.wrapper, 'select-input')}>
            <Select
                classNames={{
                    input: classes.input,
                }}
                className={className}
                onChange={(value) => setValue(value ?? '0')} // Ensure the value is set correctly on change
                value={value}
                data={data}
                checkIconPosition="right"
            />
        </div>
    );
}

// Used to aggregate related NumberSelectors together, to allow them to share a common maximum
// and know about the collective values of all the selectors
export class SharedValues {
    sharedMax: number;
    currentValue: number;

    constructor(sharedMax: number) {
        this.sharedMax = sharedMax;
        this.currentValue = 0;
    }

    get quantityRemaining() {
        return this.sharedMax - this.currentValue;
    }

    changeValue(difference: number) {
        const adjustedDifference = Math.min(difference, this.sharedMax - this.currentValue);
        this.currentValue += adjustedDifference;

        return adjustedDifference;
    }
}
