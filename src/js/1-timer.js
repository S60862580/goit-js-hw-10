import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let timeIrd = null;

const input = document.querySelector('#datetime-picker');
const button = document.querySelector('[data-start]');
const dayI = document.querySelector('[data-days]');
const hoursI = document.querySelector('[data-hours]');
const minutesI = document.querySelector('[data-minutes]');
const secondsI = document.querySelector('[data-seconds]');

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDates <= new Date()) {
      iziToast.error({ message: 'Please choose a date in the future' });
      button.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    button.disabled = false;
  },
});

button.addEventListener('click', () => {
  button.disabled = true;
  input.disabled = true;

  timeIrd = setInterval(() => {
    const currentTime = new Date();
    const timeLeft = userSelectedDate - currentTime;

    if (timeLeft <= 0) {
      clearInterval(timeIrd);
      updateTimer(0);
      input.disabled = false;
      return;
    }

    updateTimer(timeLeft);
  }, 1000);
});

function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  dayI.textContent = addLeadingZero(days);
  hoursI.textContent = addLeadingZero(hours);
  minutesI.textContent = addLeadingZero(minutes);
  secondsI.textContent = addLeadingZero(seconds);
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
