import {Link, RichTextEditor} from "@mantine/tiptap";
import {useEditor} from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import React, {useEffect, useState} from "react";
import {InputError, InputLabel, MantineFontSize} from "@mantine/core";
import classes from "./Editor.module.scss";
import classNames from "classnames";
import {Trans} from "@lingui/macro";
import {InsertImageControl} from "./Controls/InsertImageControl";
import {ImageResize} from "./Extensions/ImageResizeExtension";
import {Extension} from '@tiptap/core';

const EDITOR_COLORS = [
    '#111111',
    '#2F3437',
    '#6B7280',
    '#E5E7EB',
    '#F7F7F5',
    '#FFFFFF',
    '#D92D20',
    '#16A34A',
    '#1A6BC4',
    '#155AA8',
    '#9CA3AF',
];

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
    label?: React.ReactNode;
    description?: React.ReactNode;
    required?: boolean;
    className?: string;
    error?: string | React.ReactNode;
    editorType?: 'full' | 'simple';
    maxLength?: number;
    size?: MantineFontSize;
    additionalExtensions?: Extension[];
    additionalToolbarControls?: React.ReactNode;
}

export const Editor = ({
                           error,
                           onChange,
                           value,
                           label = '',
                           required = false,
                           className = '',
                           description = '',
                           editorType = 'full',
                           maxLength,
                           size = 'md',
                           additionalExtensions = [],
                           additionalToolbarControls,
                       }: EditorProps) => {
    const [charError, setCharError] = useState<string | null | React.ReactNode>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        style: 'margin: 0.5em 0;'
                    }
                },
                hardBreak: {
                    HTMLAttributes: {
                        'data-type': 'hard-break'
                    }
                }
            }),
            Underline,
            Link,
            TextAlign.configure({types: ['heading', 'paragraph']}),
            ImageResize,
            TextStyle,
            Color,
            ...additionalExtensions
        ],
        onUpdate: ({editor}) => {
            const html = editor.getHTML();
            const htmlLength = html.length;

            if (maxLength && htmlLength > maxLength) {
                setCharError(`Character limit exceeded: ${htmlLength}/${maxLength}`);
            } else {
                setCharError(null);
            }

            onChange(html);
        },
    });

    useEffect(() => {
        if (value && editor) {
            if (value !== editor.getHTML()) {
                editor.commands.setContent(value, false, {preserveWhitespace: "full"});
            }
            const htmlLength = value.length;

            if (maxLength && htmlLength > maxLength) {
                setCharError(<Trans>HTML character limit exceeded: {htmlLength}/{maxLength}</Trans>);
            } else {
                setCharError(null);
            }
        }
    }, [value, editor, maxLength]);

    return (
        <div className={classNames([classes.inputWrapper, className])}>
            {label && <InputLabel size={size} required={required}
                                  onClick={() => editor?.commands.focus()}>{label}</InputLabel>}
            {description && (
                <div className={classes.description}>
                    {description}
                </div>
            )}
            <RichTextEditor variant={'subtle'} editor={editor} className={classes.editorRoot}>
                <RichTextEditor.Toolbar sticky className={classes.toolbar}>
                    {editorType === 'full' && (
                        <>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold/>
                                <RichTextEditor.Italic/>
                                <RichTextEditor.Underline/>
                                <RichTextEditor.ClearFormatting/>
                                <RichTextEditor.ColorPicker
                                    colors={EDITOR_COLORS}
                                />
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.H1/>
                                <RichTextEditor.H2/>
                                <RichTextEditor.H3/>
                                <RichTextEditor.H4/>
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.BulletList/>
                                <RichTextEditor.OrderedList/>
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Link/>
                                <RichTextEditor.Unlink/>
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.AlignLeft/>
                                <RichTextEditor.AlignCenter/>
                                <RichTextEditor.AlignJustify/>
                                <RichTextEditor.AlignRight/>
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <InsertImageControl/>
                            </RichTextEditor.ControlsGroup>
                        </>
                    )}

                    {editorType === 'simple' && (
                        <>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold/>
                                <RichTextEditor.Italic/>
                                <RichTextEditor.Underline/>
                                <RichTextEditor.ClearFormatting/>
                                <RichTextEditor.ColorPicker
                                    colors={EDITOR_COLORS}
                                />
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Link/>
                                <RichTextEditor.Unlink/>
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.AlignLeft/>
                                <RichTextEditor.AlignCenter/>
                                <RichTextEditor.AlignRight/>
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.BulletList/>
                                <RichTextEditor.OrderedList/>
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <InsertImageControl/>
                            </RichTextEditor.ControlsGroup>
                        </>
                    )}
                    
                    {additionalToolbarControls}
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content/>
            </RichTextEditor>
            {(charError || error) && (
                <div className={classes.error}>
                    <InputError>{error || charError}</InputError>
                </div>
            )}
        </div>
    );
};
