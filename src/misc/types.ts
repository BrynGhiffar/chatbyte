import { FC, HTMLAttributes, InputHTMLAttributes, PropsWithChildren } from "react";

export type DivMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

export type DivWrapper = FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>>;

export type DivProps = HTMLAttributes<HTMLDivElement>;

export type InputWrapper = FC<PropsWithChildren<InputHTMLAttributes<HTMLInputElement>>>;

export type SpanWrapper = FC<PropsWithChildren<HTMLAttributes<HTMLSpanElement>>>;

export type ButtonWrapper = FC<PropsWithChildren<HTMLAttributes<HTMLButtonElement>>>;

// Detail<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>