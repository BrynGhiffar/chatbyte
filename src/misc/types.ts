import { FC, HTMLAttributes, ImgHTMLAttributes, InputHTMLAttributes, PropsWithChildren } from "react";


export type DivMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

export type ButtonMouseEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export type DivWrapper<T = {}> = FC<PropsWithChildren<HTMLAttributes<HTMLDivElement> & T>>;

export type BaseHTMLImgProps<T = {}> = FC<ImgHTMLAttributes<HTMLImageElement> & T>;

export type DivProps = HTMLAttributes<HTMLDivElement>;

export type InputWrapper = FC<PropsWithChildren<InputHTMLAttributes<HTMLInputElement>>>;

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export type SpanWrapper = FC<PropsWithChildren<HTMLAttributes<HTMLSpanElement>>>;

export type ButtonWrapper = FC<PropsWithChildren<HTMLAttributes<HTMLButtonElement>>>;

// Detail<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>