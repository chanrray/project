using System;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Text;
using System.Xml;
//using System.Xml.Linq;
//using RestSharp;
//using System.Linq;
//using System.Text.RegularExpressions;
//using System.Threading;
//using System.Threading.Tasks;
//using System.Diagnostics;


namespace DingDingMsg
{
    public class NetWorkPing
    {
        public static string LocalIP = string.Empty;
        public static string LocalLoc = string.Empty;
        private static readonly List<Serverinfo> sServerList = new List<Serverinfo>();
        public class Serverinfo
        {
            public string ServerIP;
            public string ServerLoc;
        }
        public static void LoadServerlist()
        {
            //每次新安装服务或修改配置文件都会人工测试，故不抛读取xml失败的异常
            sServerList.Clear();
            XmlDocument pXmlDoc = new XmlDocument();
            string sFilePath = AppDomain.CurrentDomain.BaseDirectory + "\\ServerList\\Server.xml";
            pXmlDoc.Load(sFilePath);
            XmlNodeList serverNode = pXmlDoc.SelectNodes("//Server");
            XmlNode localNode = pXmlDoc.SelectSingleNode("//Local");
            LocalIP = localNode.SelectSingleNode("LocalAddress").InnerText;
            LocalLoc = localNode.SelectSingleNode("LocalLoc").InnerText;
            foreach (XmlElement element in serverNode)
            {
                Serverinfo oServerI = new Serverinfo
                {
                    ServerIP = element.GetElementsByTagName("ServerAddress")[0].InnerText,
                    ServerLoc = element.GetElementsByTagName("ServerLoc")[0].InnerText
                };
                sServerList.Add(oServerI);
            }
        }
        public static void Pingtest()
        {
            LoadServerlist();
            var failedServers = PingServers(sServerList);
            if (failedServers.Count > 0)
            {
                string sMsgBody = string.Join("\r\n", failedServers);
                DingDingSendMsg.PostDingDing(sMsgBody);
                //SendEmail(sEmailBody);也可以添加发送邮件报警功能。
            }
        }
        public static void PingDailytest()
        {
            LoadServerlist();
            var failedServers = PingServers(sServerList);
            if (failedServers.Count == 0)
            {
                string sMsgBody = $"服务器【{LocalIP}】-【{LocalLoc}】与其他服务器测试连通性正常！";
                DingDingSendMsg.PostDingDing(sMsgBody);
            }
            else
            {
                string sMsgBody = string.Join("\r\n", failedServers);
                DingDingSendMsg.PostDingDing(sMsgBody);
            }
        }
        public static List<string> PingServers(List<Serverinfo> servers)
        {
            List<string> errorMessages = new List<string>();
            List<Serverinfo> currentFailedServers = new List<Serverinfo>(servers);
            int attempts = 0;
            while (attempts < 3 && currentFailedServers.Count > 0)  //ping三次测试
            {
                List<Serverinfo> nextAttemptFailedServers = new List<Serverinfo>();
                foreach (var server in currentFailedServers)
                {
                    if (!TryPingServer(server, 120, out string message))
                    {
                        nextAttemptFailedServers.Add(server);
                    }
                }
                currentFailedServers = nextAttemptFailedServers;
                attempts++;
            }
            foreach (var server in currentFailedServers)  //对高延迟追加一次测试并给出ping延迟时间
            {

                if (TryPingServer(server, 2000, out string message))
                {
                    errorMessages.Add(message);
                }
                else
                {
                    string errorMessage = $"服务器【{LocalIP}】-【{LocalLoc}】 ping【{server.ServerIP}】-【{server.ServerLoc}】，连接不通！";
                    errorMessages.Add(errorMessage);
                }
            }
            return errorMessages;
        }
        private static bool TryPingServer(Serverinfo server, int timeout, out string resultMessage)
        {
            using (Ping pingSender = new Ping())
            {
                string data = "ping " + server.ServerIP;
                byte[] buffer = Encoding.ASCII.GetBytes(data);
                PingOptions options = new PingOptions { DontFragment = true };
                PingReply reply = pingSender.Send(server.ServerIP, timeout, buffer, options);
                //此处本意是用不同timeout来限定RTT时间得到成功或超时结果，较高延迟机器经常得到错误结果与预期不一致。经过详细分析反编译、WPR分析内核和查阅资料得知是WINAPI IcmpSendEcho2的bug：timeout低于1000会间歇性返回错误结果。
                if (reply.Status == IPStatus.Success)
                {
                    resultMessage = $"服务器【{LocalIP}】-【{LocalLoc}】 ping【{server.ServerIP}】-【{server.ServerLoc}】，延时为【{reply.RoundtripTime}】毫秒！";
                    return true;
                }
                else
                {
                    resultMessage = string.Empty;
                    return false;
                }
            }
        }
    }
}
