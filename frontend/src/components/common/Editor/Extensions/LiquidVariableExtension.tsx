import { Node } from '@tiptap/core';

export const LiquidVariable = Node.create({
    name: 'liquidVariable',

    group: 'inline',

    inline: true,

    atom: true,

    addAttributes() {
        return {
            variable: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-liquid-variable]',
            },
        ];
    },

    renderHTML({ node }) {
        return [
            'span',
            {
                'data-liquid-variable': node.attrs.variable,
                style: 'background-color: color-mix(in srgb, var(--hi-primary) 10%, var(--hi-color-white)); color: var(--hi-primary-hover); border: 1px solid color-mix(in srgb, var(--hi-primary) 18%, var(--hi-border)); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; white-space: nowrap;',
            },
            `{{ ${node.attrs.variable} }}`,
        ];
    },

    addCommands() {
        return {
            insertLiquidVariable: (variable: string) => ({ chain }) => {
                return chain()
                    .insertContent({
                        type: this.name,
                        attrs: { variable },
                    })
                    .run();
            },
        };
    },
});
