import { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Next Durga Puja: September 28, 2025
    const targetDate = new Date("2025-09-28T00:00:00");
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-2xl font-bold text-white shadow-lg sm:h-20 sm:w-20 sm:text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-2 text-xs font-medium text-orange-800 sm:text-sm">{label}</span>
    </div>
  );

  return (
    <div className="rounded-2xl bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
          <Clock className="h-6 w-6 text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-orange-900 sm:text-2xl">দুর্গাপূজা কাউন্টডাউন</h2>
          <p className="flex items-center gap-1 text-sm text-orange-700">
            <Calendar className="h-4 w-4" />
            ২৮ সেপ্টেম্বর ২০২৫
          </p>
        </div>
      </div>
      
      <div className="flex justify-center gap-3 sm:gap-6">
        <TimeBox value={timeLeft.days} label="দিন" />
        <TimeBox value={timeLeft.hours} label="ঘণ্টা" />
        <TimeBox value={timeLeft.minutes} label="মিনিট" />
        <TimeBox value={timeLeft.seconds} label="সেকেন্ড" />
      </div>
    </div>
  );
}
