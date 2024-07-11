'use client';

import Cookies from 'js-cookie'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import '@/app/scss/pages/dashboard.scss';


export default function Page(){

    // States
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

    // Requests
    const fetchTransactions = async (period:string) => {
        const response = await fetch(`/api/transactions?date=${period}&token=${Cookies.get('userLogged')}`);
        const data = await response.json();
        setRows(data.transactions);
        const calculateBalancePaid = (rows:any) => {
            let total = 0;
            rows && rows.forEach((row:any) => {
                if (row.paid) {
                    if (row.type === 1) {
                        total += parseFloat(row.value);
                    } else {
                        total -= parseFloat(row.value);
                    }
                }
            });
            return total;
        };
        setBalancePaid(calculateBalancePaid(data.transactions));
        const calculateBalanceNotPaid = (rows:any) => {
            let total = 0;
            rows && rows.forEach((row:any) => {
                if (!row.paid) {
                    if (row.type === 1) {
                        total += parseFloat(row.value);
                    } else {
                        total -= parseFloat(row.value);
                    }
                }
            });
            return total;
        };
        setBalanceNotPaid(calculateBalanceNotPaid(data.transactions));
    }
    useEffect(() => {
        setDate(getCurrentDate());
        setCurrentDate(getCurrentDate());
        fetchTransactions(getCurrentDate());
    }, []);

    // Utils
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = (today.getMonth() + 1).toString();
        let day = (today.getDate()).toString();
        if (month.length === 1) {
            month = `0${month}`;
          }
          if (day.length === 1) {
            day = `0${day}`;
          }
          const formattedDate = `${year}-${month}-${day}`;
          return formattedDate;
    }
    const formatDate = (date:string) => {
        const months : {[key: string]:string} = {
            '01': 'January',
            '02': 'February',
            '03': 'March',
            '04': 'April',
            '05': 'May',
            '06': 'June',
            '07': 'July',
            '08': 'August',
            '09': 'September',
            '10': 'October',
            '11': 'November',
            '12': 'December'
        };
        let dateFormatted;
        //dateFormatted = `${months[(date).slice(5,7)]} ${(date).slice(8,10)}, ${(date).slice(0,4)}`;
        dateFormatted = `Day ${(date).slice(8,10)}`;
        return dateFormatted;
    }
    const formatPeriod = (date:string) => {
        const months : {[key: string]:string} = {
            '01': 'January',
            '02': 'February',
            '03': 'March',
            '04': 'April',
            '05': 'May',
            '06': 'June',
            '07': 'July',
            '08': 'August',
            '09': 'September',
            '10': 'October',
            '11': 'November',
            '12': 'December'
        };
        let dateFormatted;
        dateFormatted = `${months[(date).slice(5,7)]} ${(date).slice(0,4)}`;
        return dateFormatted;
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
    const closePopup = (ref:string) => {
        const popup = document.querySelector(`${ref}`);
        if (popup) {
            popup.classList.remove(`active`);
        }
    }
    const closeAllPopups = () => {
        const popups = document.querySelectorAll('.popup');
        popups.forEach(popup => {
            popup.classList.remove('active');
        })
    }
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
        const filteredValue = value.replace(/[^0-9.,]/g, '');
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
            <div className="options">
                <div className="options__left"></div>
                <div className="options__period">
                    <button onClick={() => handleDateChanging('prev')}>
                        <img src="/icons/angle-left.svg"/>
                    </button>
                    <span>{formatPeriod(currentDate?currentDate:getCurrentDate())}</span>
                    <button onClick={() => handleDateChanging('next')}>
                        <img src="/icons/angle-right.svg"/>
                    </button>
                </div>
                <div className="options__buttons">
                    <button onClick={() => handleNewTransaction(`#popup-new-transaction`)}>
                        <img src="/icons/plus.svg"/> <span className="text text--bold">New transaction</span>
                    </button>
                </div>
                <div className="popup" id={`popup-new-transaction`}>
                    <div className="popup__box">
                        <div className="popup__box__header">
                            <img src="/icons/plus.svg"/>
                            <span>New transaction</span>
                            <button onClick={() => closePopup(`#popup-new-transaction`)}><img src="/icons/close.svg"/></button>
                        </div>
                        <div className="popup__box__content">
                            <form>
                                <label htmlFor="description">
                                    <input required placeholder="Description" name="text" id="text" value={description} onChange={(e) => handleDescription(e.target.value)}/>
                                </label>
                                <label htmlFor="value">
                                    <input inputMode="decimal" required placeholder="Value" type="text" name="value" id="value" value={value} onChange={(e) => handleValue(e.target.value)}/>
                                </label>
                                <label htmlFor="type">
                                    <select required name="type" id="type" value={type} onChange={(e) => handleType(e.target.value)}>
                                        <option value="1">Income</option>
                                        <option value="2">Expense</option>
                                    </select>
                                </label>
                                <label htmlFor="recurring">
                                    <select required name="recurring" id="recurring" value={recurring} onChange={(e) => handleRecurring(e.target.value)}>
                                        <option value="0">Just once</option>
                                        <option value="1">Every month</option>
                                    </select>
                                </label>
                                <label htmlFor="date">
                                    <input type="date" name="date" id="date" value={date} onChange={(e) => handleDate(e.target.value)}/>
                                </label>
                                <label htmlFor="paid">
                                    <select required name="paid" id="paid" value={paid} onChange={(e) => handlePaid(e.target.value)}>
                                        <option value="0">Pending</option>
                                        <option value="1">Paid/received</option>
                                    </select>
                                </label>
                            </form>
                        </div>
                        <div className="popup__box__footer">
                            <button className="text text--dark" onClick={(e) => handleSaveTransaction(e)}>Save transaction</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="responsive-table">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Recurring</th>
                            <th>Date</th>
                            <th>Value</th>
                            <th>Paid/received</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows && rows.map((row:any) => (
                            <tr key={row.id} id={`transaction-${row.id}`} attr-val={row.id} attr-type={row.type}>
                                <td id={`transaction-description-${row.id}`} attr-val={row.description}>{row.description}</td>
                                <td id={`transaction-recurring-${row.id}`} attr-val={row.recurring}>{row.recurring == 0 ? '-' : 'Every month'}</td>
                                <td id={`transaction-date-${row.id}`} attr-val={row.date}>{formatDate(row.date)}</td>
                                <td id={`transaction-value-${row.id}`} attr-val={row.value} className={row.type == 1 ? 'text text--bold text--success' : 'text text--bold text--danger'}>
                                    {row.type == 1 ? '(+)' : '(-)'} {parseFloat(row.value).toFixed(2)} 
                                </td>
                                <td id={`transaction-paid-${row.id}`} attr-val={row.paid == 1 ? '1' : '0'}>{row.paid == 1 ? 'Yes' : '-'}</td>
                                <td>
                                    <button onClick={() => openPopup(`#popup-${row.id}`, true)}>
                                        <img src="/icons/edit.svg"/>
                                    </button>
                                </td>
                                <div className="popup" id={`popup-${row.id}`} attr-from-transaction={row.from_transaction}>
                                    <div className="popup__box">
                                        <div className="popup__box__header">
                                            <img src="/icons/edit.svg"/>
                                            <span>Edit transaction</span>
                                            <button onClick={() => closePopup(`#popup-${row.id}`)}><img src="/icons/close.svg"/></button>
                                        </div>
                                        <div className="popup__box__content">
                                            <form>
                                                <input required type="hidden" name="id" id="id" value={id}/>
                                                <input required type="hidden" name="from_transaction" id="from_transaction" value={fromTransaction}/>
                                                <label htmlFor="description">
                                                    <input required placeholder="Description" name="text" id="text" value={description} onChange={(e) => handleDescription(e.target.value)}/>
                                                </label>
                                                <label htmlFor="value">
                                                    <input inputMode="decimal" required placeholder="Value" type="text" name="value" id="value" value={value} onChange={(e) => handleValue(e.target.value)}/>
                                                </label>
                                                <label htmlFor="date">
                                                    <input type="date" name="date" id="date" value={date} onChange={(e) => handleDate(e.target.value)}/>
                                                </label>
                                                <label htmlFor="paid">
                                                    <select required name="paid" id="paid" value={paid} onChange={(e) => handlePaid(e.target.value)}>
                                                        <option value="0">Pending</option>
                                                        <option value="1">Paid/received</option>
                                                    </select>
                                                </label>
                                            </form>
                                        </div>
                                        <div className="popup__box__footer">
                                            <button className="text text--danger" onClick={() => openPopup(`#popup-delete-${row.id}`)}>Delete transaction</button>
                                            <button className="text text--dark" onClick={(e) => handleUpdateTransaction(e)}>Confirm changes</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="popup" id={`popup-delete-${row.id}`}>
                                    <div className="popup__box">
                                        <div className="popup__box__header">
                                            <img src="/icons/trash.svg"/>
                                            <span>Delete transaction</span>
                                            <button onClick={() => openPopup(`#popup-${row.id}`)}><img src="/icons/close.svg"/></button>
                                        </div>
                                        <div className="popup__box__content">
                                            Are you sure you want to delete this transaction? This action will directly affect your balance.
                                        </div>
                                        <div className="popup__box__footer">
                                            <button className="text text--dark" onClick={() => openPopup(`#popup-${row.id}`)}>Cancel</button>
                                            {row.recurring || row.from_transaction > 0 ? (
                                                <button className="text text--danger" onClick={(e) => handleDeleteTransaction(row.id, e, 'all', row.from_transaction)}>Delete this and the next ones</button>
                                            ) : null }
                                            <button className="text text--danger" onClick={(e) => handleDeleteTransaction(row.id, e, 'this', 0)}>Delete only this one</button>
                                        </div>
                                    </div>
                                </div>
                            </tr>
                        ))}
                        {rows?'':
                            <tr>
                                <td colSpan={6} className="message">No transactions found</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className="balance">
                <h4>Balance (pending)</h4>
                <h2>{balanceNotPaid.toFixed(2)}</h2>
                <h4>Balance (paid/received)</h4>
                <h1 className={`text ${balancePaid>=0?'text--success':'text--danger'}`}>{balancePaid.toFixed(2)}</h1>
            </div>
        </>
    );

}