import React from 'react';
import * as style from './Modal.scss';

const Title = ({ children }) => <div className={style.Title}>{children}</div>;

const HeaderRight = ({ children }) => <div className={style.headerRight}>{children}</div>;

const Header = ({ children }) => <div className={style.Header}>{children({ Title, HeaderRight })}</div>;

const Body = ({ children }) => <div className={style.Body}>{children}</div>;

const Footer = ({ children }) => <div className={style.Footer}>{children}</div>;

const Modal = ({ children }) => <div className={style.self}>{children({ Header, Body, Footer })}</div>;

export default Modal;
