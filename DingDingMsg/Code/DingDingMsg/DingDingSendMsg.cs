using System;
using System.Collections.Generic;
using System.Xml;
using System.IO;
using System.Text;
using System.Net;
//using System.Net.NetworkInformation;
//using System.Linq;
//using System.Text.RegularExpressions;
//using System.Threading;
//using System.Threading.Tasks;
//using System.Diagnostics;


namespace DingDingMsg
{
    public class DingDingSendMsg
    {
        private static string _baseUrl;
        private static string _accessToken;
        private static void LoadDingTalkConfig()
        {
            XmlDocument pXmlDoc = new XmlDocument();
            string sFilePath = AppDomain.CurrentDomain.BaseDirectory + "\\ServerList\\Api.xml";
            pXmlDoc.Load(sFilePath);
            XmlNode dingTalkNode = pXmlDoc.SelectSingleNode("//DingTalk");
            _baseUrl = dingTalkNode.SelectSingleNode("BaseUrl")?.InnerText;
            _accessToken = dingTalkNode.SelectSingleNode("AccessToken")?.InnerText;
        }
        public static string PostDingDing(string sMsg, Dictionary<string, string> headers = null)
        {
            LoadDingTalkConfig();    //api.xml可优化成只读取一次配置文件而不是每次都读取，server.xml则支持实时修改和生效。
            string apiurl = $"{_baseUrl}?access_token={_accessToken}";
            WebRequest request = WebRequest.Create(@apiurl);
            request.Method = "POST";
            request.ContentType = "application/json";
            if (headers != null)
            {
                foreach (var keyValue in headers)
                {
                    if (keyValue.Key == "Content-Type")
                    {
                        request.ContentType = keyValue.Value;
                        continue;
                    }
                    request.Headers.Add(keyValue.Key, keyValue.Value);
                }
            }
            string jsonString = "{\"msgtype\":\"text\",\"text\":{\"content\":\"SENDMSG\"}}".Replace("SENDMSG", sMsg);
            if (string.IsNullOrEmpty(jsonString))
            {
                request.ContentLength = 0;
            }
            else
            {
                byte[] bs = Encoding.UTF8.GetBytes(jsonString);
                request.ContentLength = bs.Length;
                Stream newStream = request.GetRequestStream();
                newStream.Write(bs, 0, bs.Length);
                newStream.Close();
            }
            WebResponse response = request.GetResponse();
            Stream stream = response.GetResponseStream();
            Encoding encode = Encoding.UTF8;
            StreamReader reader = new StreamReader(stream, encode);
            string resultJson = reader.ReadToEnd();
            return resultJson;
        }

    }

}
