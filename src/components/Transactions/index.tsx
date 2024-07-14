'use client';

import Cookies from 'js-cookie'; 
import { useState, useEffect } from 'react';
import '@/styles/pages/transactions.scss';

import PopupNewTransaction from '@/components/Transactions/Popup/NewTransaction';
import Table from '@/components/Transactions/Table';
import Balance from '@/components/Transactions/Balance';
import Options from '@/components/Transactions/Options';

import { getCurrentDate } from '@/utils/getCurrentDate';
import { calculateBalancePaid } from '@/utils/calculateBalancePaid';
import { calculateBalanceNotPaid } from '@/utils/calculateBalanceNotPaid';
import { formatDate } from '@/utils/formatDate';
import { formatPeriod } from '@/utils/formatPeriod';
import { closePopup } from '@/utils/closePopup';
import { closeAllPopups } from '@/utils/closeAllPopups';

export default function Page(){

    useEffect(() => {
        setDate(getCurrentDate());
        setCurrentDate(getCurrentDate());
        fetchTransactions(getCurrentDate());
    }, []);

    // Use states
    const [rows, setRows] = useState([] as any);
    const [balancePaid, setBalancePaid] = useState(0 as number);
    const [balanceNotPaid, setBalanceNotPaid] = useState(0 as number);
    const [id, setId] = useState('' as string);
    const [fromTransaction, setFromTransaction] = useState('' as string);
    const [value, setValue] = useState('' as string);
    const [description, setDescription] = useState('' as string);
    const [date, setDate] = useState('' as string);
    const [type, setType] = useState('1' as string);
    const [recurring, setRecurring] = useState('0' as string);
    const [paid, setPaid] = useState('0' as string);
    const [currentDate, setCurrentDate] = useState('' as string);

    // Request 

    const fetchTransactions = async (period:string) => {
        const response = await fetch(`/api/transactions?date=${period}&token=${Cookies.get('userLogged')}`);
        const data = await response.json();
        setRows(data.transactions);
        setBalancePaid(calculateBalancePaid(data.transactions));
        setBalanceNotPaid(calculateBalanceNotPaid(data.transactions));
    }

    const saveTransaction = async (e:any) => {
        const response = await fetch(`/api/newTransaction?paid=${paid}&value=${value}&description=${description}&date=${date}&type=${type}&recurring=${recurring}&token=${Cookies.get('userLogged')}`);
        const data = await response.json();
        if (data.code == 1) {
            closeAllPopups();
            fetchTransactions(currentDate);
        } else {
            e.target.classList.remove('disabled');
        }
    }

    const updateTransaction = async (e:any) => {
        const response = await fetch(`/api/updateTransaction?paid=${paid}&id=${id}&value=${value}&description=${description}&date=${date}&from_transaction=${fromTransaction}&token=${Cookies.get('userLogged')}`);
        const data = await response.json();
        if (data.code == 1) {
            closeAllPopups();
            fetchTransactions(currentDate);
        } else {
            e.target.classList.remove('disabled');
        }
    }

    const deleteTransaction = async (id:number, e:any, which:string, from_transaction:number) => {
        const response = await fetch(`/api/deleteTransaction?id=${id}&which=${which}&from_transaction=${fromTransaction}&date=${date}&token=${Cookies.get('userLogged')}`);
        const data = await response.json();
        if (data.code == 1) {
            closeAllPopups();
            resetAllForms();
            const transaction = document.querySelector(`#transaction-${id}`);
            if (transaction) {
                transaction.classList.add('removed--1');
                setTimeout(() => {
                    transaction.classList.add('removed--2');
                    setTimeout(() => {
                        transaction.classList.add('removed--3');
                        setTimeout(() => {
                            fetchTransactions(currentDate);
                        }, 300);
                    }, 300);
                }, 1000);
            }
        } else {
            e.target.classList.remove('disabled');
        }
    }

    // Utils

    const resetAllForms = () => {
        setValue('');
        setDescription('');
        setDate('');
        setType('1');
        setRecurring('0');
        setPaid('0');
        setDate(getCurrentDate());
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button) {
                button.classList.remove('disabled');
            }
        })
    }

    const prevPeriod = () => {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const result = `${year}-${month}-${day}`;
        return result;
    }

    const nextPeriod = () => {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() + 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const result = `${year}-${month}-${day}`;
        return result;
    }

    const openPopup = (ref:string,transaction:boolean = false) => {
        const popups = document.querySelectorAll(`.popup`);
        popups.forEach((popup) => {
            popup.classList.remove(`active`);
        })
        const popup = document.querySelector(`${ref}`);
        if (popup) {
            popup.classList.add(`active`);
        }
        if (transaction) {
            const id = ref.replace('#popup-','');
            const element = document.querySelector(`${ref}`);
            if (element) {
                const from_transaction = element.getAttribute('attr-from-transaction');
                if (from_transaction) {
                    setFromTransaction(from_transaction);
                }
            }
            setId(id);
            const type = document.querySelector(`#transaction-${id}`);
            if(type) {
                const typeVal = type.getAttribute('attr-type');
                if (typeVal) {
                    handleType(typeVal);
                }
            }
            const description = document.querySelector(`#transaction-description-${id}`);
            if(description) {
                const descriptionVal = description.getAttribute('attr-val');
                if (descriptionVal) {
                    handleDescription(descriptionVal);
                }
            }
            const recurring = document.querySelector(`#transaction-recurring-${id}`);
            if(recurring) {
                const recurringVal = recurring.getAttribute('attr-val');
                if (recurringVal) {
                    handleRecurring(recurringVal);
                }
            }
            const date = document.querySelector(`#transaction-date-${id}`);
            if(date) {
                const dateVal = date.getAttribute('attr-val');
                if (dateVal) {
                    handleDate(dateVal.slice(0, 10));
                }
            }
            const value = document.querySelector(`#transaction-value-${id}`);
            if(value) {
                const valueVal = value.getAttribute('attr-val');
                if (valueVal) {
                    handleValue(valueVal);
                }
            }
            const paid = document.querySelector(`#transaction-paid-${id}`);
            if(paid) {
                const paidVal = paid.getAttribute('attr-val');
                if (paidVal) {
                    handlePaid(paidVal);
                }
            }
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.classList.remove('disabled');
            })
        }
    }

    // Handlers

    const handleSaveTransaction = (e:any) => {
        e.target.classList.add('disabled');
        return saveTransaction(e);
    }

    const handleUpdateTransaction = (e:any) => {
        e.target.classList.add('disabled');
        return updateTransaction(e);
    }

    const handleDeleteTransaction = (id:number, e:any, which:string, from_transaction:number) => {
        e.target.classList.add('disabled');
        return deleteTransaction(id, e, which, from_transaction);
    }

    const handleDescription = (value:string) => {
        return setDescription(value);
    }

    const handleValue = (value: string) => {
        const filteredValue = value.replace(/[^0-9.]/g, '');
        return setValue(filteredValue);
    }

    const handleType = (value:string) => {
        return setType(value);
    }

    const handleDate = (value:string) => {
        return setDate(value);
    }

    const handleRecurring = (value:string) => {
        return setRecurring(value);
    }

    const handlePaid = (value:string) => {
        return setPaid(value);
    }

    const handleDateChanging = (direction:string) => {
        if (direction == 'prev') {
            fetchTransactions(prevPeriod());
            setCurrentDate(prevPeriod());
        } else {
            fetchTransactions(nextPeriod());
            setCurrentDate(nextPeriod());
        }
    }

    const handleNewTransaction = (ref:string) => {
        resetAllForms();
        openPopup(`#popup-new-transaction`);
    }

    return (
        <>
            <PopupNewTransaction
                description={description}
                value={value}
                type={type}
                recurring={recurring}
                date={date}
                paid={paid}
                closePopup={closePopup}
                handleDescription={handleDescription}
                handleValue={handleValue}
                handleType={handleType}
                handleRecurring={handleRecurring}
                handleDate={handleDate}
                handlePaid={handlePaid}
                handleSaveTransaction={handleSaveTransaction}
            />
            <Options
                currentDate={currentDate}
                handleDateChanging={handleDateChanging}
                formatPeriod={formatPeriod}
                getCurrentDate={getCurrentDate}
                handleNewTransaction={handleNewTransaction}
            />
            <Table
                rows={rows}
                description={description}
                value={value}
                date={date}
                paid={paid}
                formatDate={formatDate}
                openPopup={openPopup}
                closePopup={closePopup}
                handleDescription={handleDescription}
                handleValue={handleValue}
                handleType={handleType}
                handleRecurring={handleRecurring}
                handleDate={handleDate}
                handlePaid={handlePaid}
                handleUpdateTransaction={handleUpdateTransaction}
                handleDeleteTransaction={handleDeleteTransaction}
            />
            <Balance
                balanceNotPaid={balanceNotPaid}
                balancePaid={balancePaid}
            />
        </>
    );

}