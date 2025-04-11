using DingDingMsg;
using System.ServiceProcess;
using System.Timers;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel;
//using System.Data;
//using System.Diagnostics;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;


namespace WindowsService1
{
    public partial class Service1 : ServiceBase
    {
        public Service1()
        {
            InitializeComponent();
            //创建一个指定定时器
            System.Timers.Timer timer = new System.Timers.Timer
            {
                Enabled = true,
                Interval = 60000//执行间隔时间,单位为毫秒  
            };
            timer.Start();
            timer.Elapsed += new System.Timers.ElapsedEventHandler(Timer_Elapsed);
        }

        public void Timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            // 得到 hour minute second  如果等于某个值就开始执行某个程序。  
            int intHour = e.SignalTime.Hour;
            int intMinute = e.SignalTime.Minute;
            // string sDate = DateTime.Now.ToString("yyyy-MM-dd");

            if (intMinute % 2 == 0)   //每2分钟Ping测试
            {
                NetWorkPing.Pingtest();
            }
            if (intHour == 12 && intMinute == 30)    //中午吃饭前整点播报
            {
                NetWorkPing.PingDailytest();
            }
            if (intMinute == 0 && intHour >=9 && intHour<=20)   //上班时间整点播报
            {
                NetWorkPing.PingDailytest();
            }

        }

        protected override void OnStart(string[] args)
        {
        }
        protected override void OnStop()
        {
        }
    }
}
