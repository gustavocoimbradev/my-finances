'use client';

import Cookies from 'js-cookie'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import '@/app/scss/pages/dashboard.scss';


export default function Page(){

    // States
    const [rows, setRows] = useState([] as any);
    const [balance, setBalance] = useState(0 as number);
    const [value, setValue] = useState('' as string);
    const [description, setDescription] = useState('' as string);
    const [date, setDate] = useState('' as string);
    const [type, setType] = useState('1' as string);
    const [recurring, setRecurring] = useState('1' as string);
    const [currentDate, setCurrentDate] = useState('' as string);

    // Requests
    const fetchTransactions = async (period:string) => {
        const response = await fetch(`/api/transactions?date=${period}&token=${Cookies.get('userLogged')}`);
        const data = await response.json();
        setRows(data.transactions);
        const calculateBalance = (rows:any) => {
            let total = 0;
            rows && rows.forEach((row:any) => {
                if (row.type === 1) {
                    total += parseFloat(row.value);
                } else {
                    total -= parseFloat(row.value);
                }
            });
            return total;
        };
        setBalance(calculateBalance(data.transactions));
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
    const openPopup = (ref:string) => {
        const popups = document.querySelectorAll(`.popup`);
        popups.forEach((popup) => {
            popup.classList.remove(`active`);
        })
        const popup = document.querySelector(`${ref}`);
        if (popup) {
            popup.classList.add(`active`);
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
        setRecurring('1');
        setDate(getCurrentDate());
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button) {
                button.classList.remove('disabled');
            }
        })
    }
    const saveTransaction = async (e:any) => {
        const response = await fetch(`/api/newTransaction?value=${value}&description=${description}&date=${date}&type=${type}&recurring=${recurring}&token=${Cookies.get('userLogged')}`);
        const data = await response.json();
        if (data.code == 1) {
            closeAllPopups();
            fetchTransactions(currentDate);
            resetAllForms();
        } else {
            e.target.classList.remove('disabled');
        }
    }
    const deleteTransaction = async (id:number, e:any) => {
        const response = await fetch(`/api/deleteTransaction?id=${id}&token=${Cookies.get('userLogged')}`);
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
    const handleDeleteTransaction = (id:number, e:any) => {
        e.target.classList.add('disabled');
        return deleteTransaction(id, e);
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
    const handleDateChanging = (direction:string) => {
        if (direction == 'prev') {
            fetchTransactions(prevPeriod());
            setCurrentDate(prevPeriod());
        } else {
            fetchTransactions(nextPeriod());
            setCurrentDate(nextPeriod());
        }
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
                    <button onClick={() => openPopup(`#popup-new-transaction`)}>
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
                                        <option value="1">Just once</option>
                                        <option value="2">Every month</option>
                                    </select>
                                </label>
                                <label htmlFor="date">
                                    <input type="date" name="date" id="date" value={date} onChange={(e) => handleDate(e.target.value)}/>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows && rows.map((row:any) => (
                            <tr key={row.id} id={`transaction-${row.id}`}>
                                <td>{row.description ?? 'No description provided'}</td>
                                <td>{row.recurring == 1 ? 'Just once' : 'Every month'}</td>
                                <td>{formatDate(row.date)}</td>
                                <td className={row.type == 1 ? 'text text--bold text--success' : 'text text--bold text--danger'}>
                                    {row.type == 1 ? '(+)' : '(-)'} {parseFloat(row.value).toFixed(2)} 
                                </td>
                                <td>
                                    <button onClick={() => openPopup(`#popup-${row.id}`)}>
                                        <img src="/icons/edit.svg"/>
                                    </button>
                                </td>
                                <div className="popup" id={`popup-${row.id}`}>
                                    <div className="popup__box">
                                        <div className="popup__box__header">
                                            <img src="/icons/edit.svg"/>
                                            <span>Edit transaction</span>
                                            <button onClick={() => closePopup(`#popup-${row.id}`)}><img src="/icons/close.svg"/></button>
                                        </div>
                                        <div className="popup__box__content">
                                            Upcoming
                                        </div>
                                        <div className="popup__box__footer">
                                            <button className="text text--danger" onClick={() => openPopup(`#popup-delete-${row.id}`)}>Delete transaction</button>
                                            <button className="text text--dark">Confirm changes</button>
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
                                            <button className="text text--danger" onClick={(e) => handleDeleteTransaction(row.id, e)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="balance">
                <h4>Balance for the period</h4>
                <h1 className={`text ${balance>=0?'text--success':'text--danger'}`}>{balance.toFixed(2)}</h1>
            </div>
        </>
    );

}