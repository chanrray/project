using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using System.Net.Mail;
using System.Windows.Forms;
using System.Web.Mail;
using System.Net.Security;
using System.Net;
using System.Security.Cryptography.X509Certificates;


namespace WinFormsApp1
{
    public partial class Form1 : Form
    {

        //  private Attachment  mailAttachment;

        public Form1()
        {
            InitializeComponent();
            //ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
            //ServicePointManager.ServerCertificateValidationCallback = (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;
            //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls1.2;
            //忽略证书验证设置无效果
        }

        private void ButtonAttachment_Click(object sender, EventArgs e)
        {
            OpenFileDialog openFileDialog = new OpenFileDialog();
            openFileDialog.CheckFileExists = true;  //不存在文件名显示警告
            openFileDialog.ValidateNames = true;    //值接受Win32文件
            openFileDialog.Multiselect = true;     //允许多选文件
            openFileDialog.Filter = "All(*.*)|*.*";
            if (openFileDialog.ShowDialog() == DialogResult.OK)
            {
                foreach (var item in openFileDialog.FileNames)
                {
                    this.textAttachment.Text += item+";\r\n";
                }
            }
        }
        private List<Attachment> AddAttachment()
        {
            List<Attachment> olst = new List<Attachment>();
            string input = this.textAttachment.Text;
            char[] separators = { ';', '\r', '\n' }; // 指定分隔符
            // 拆分字符串
            string[] itemsArray = input.Split(separators);
            // 转换为列表
            List<string> itemsList = new List<string>(itemsArray);
            foreach (string item in itemsList)
            { 
                if (!string.IsNullOrEmpty(item))
                {
                    Attachment aitm = new Attachment(item);
                    olst.Add(aitm);
                }
            }
            return olst;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            this.textSubject.Text = "邮件主题";
            this.textBody.Text = "邮件正文";
            this.textTo.Text = "输入收件人";
            this.textFrom.Text = "输入发件人";
            this.textPasswd.Text = "输入邮箱密码";
            this.textServer.Text = "输入邮箱服务器";
        }

        private void ButtonSend25_Click(object sender, EventArgs e)
        {

            try
            {
                System.Net.Mail.MailMessage mailMsg = new System.Net.Mail.MailMessage();  //定义并生成实例
                mailMsg.From = new MailAddress(textFrom.Text);
                mailMsg.To.Add(textTo.Text);
                mailMsg.Subject = textSubject.Text;
                mailMsg.SubjectEncoding = Encoding.Default;
                mailMsg.Body = textBody.Text;
                mailMsg.BodyEncoding = Encoding.Default;
               // mailMsg.Priority = System.Net.Mail.MailPriority.High;
                foreach (var item in AddAttachment())
                {
                    mailMsg.Attachments.Add(item);
                }
                SmtpClient client = new SmtpClient();
                client.Host = textServer.Text;
                //client.Port = Convert.ToInt16(portnum.Text);
                client.Port = 25;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.Credentials = new System.Net.NetworkCredential(textFrom.Text, textPasswd.Text);
                client.Send(mailMsg);
                MessageBox.Show("Mail Send Success！", "Info", MessageBoxButtons.OK, MessageBoxIcon.Information);
                textLog.Text = "";
            }
            catch (Exception m) //异常处理
            {
                textLog.Text = m.Message;
                MessageBox.Show(m.Message);
            }
        }

        //system.net.mail不支持隐式SSL，换成system.web.mail
         private void ButtonSend465_Click(object sender, EventArgs e)
           {
         
           

            try
            {
                   System.Web.Mail.MailMessage mail = new System.Web.Mail.MailMessage();
                   mail.To = textTo.Text;
                   mail.From = textFrom.Text;
                   mail.Subject = textSubject.Text;
                   mail.BodyFormat = MailFormat.Html;
                   mail.Body = textBody.Text;

                   foreach (var item in AddAttachment())
                   {
                       MailAttachment oitm = new MailAttachment(((System.IO.FileStream)item.ContentStream).Name);
                       mail.Attachments.Add(oitm);
                   }
                   List<Attachment> olst = new List<Attachment>(); 
                   mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate", "1"); //身份验证
                   mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendusername", mail.From); //邮箱登录账号，这里跟前面的发送账号一样就行
                   mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendpassword", textPasswd.Text); //这个密码要注意：qq邮箱等要用授权码；企业账号用登录密码
                   mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpserverport", 465);//端口
                   mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpusessl", "true");//SSL加密
                   System.Web.Mail.SmtpMail.SmtpServer = textServer.Text;
                   System.Web.Mail.SmtpMail.Send(mail);


                   MessageBox.Show("Mail Send Success！", "Info", MessageBoxButtons.OK, MessageBoxIcon.Information);
                   textLog.Text = "";
               }
               catch (Exception ex) //异常处理
               {
                   textLog.Text = ex.Message;
                   MessageBox.Show(ex.Message);
               }

           }  
      
     private void ButtonSend587_Click(object sender, EventArgs e)
        {
            try
            {
                System.Net.Mail.MailMessage mailMsg = new System.Net.Mail.MailMessage();  //实例化
                mailMsg.From = new MailAddress(textFrom.Text);
                mailMsg.To.Add(textTo.Text);
                mailMsg.Subject = textSubject.Text;
                mailMsg.SubjectEncoding = Encoding.Default;
                mailMsg.Body = textBody.Text;
                mailMsg.BodyEncoding = Encoding.Default;
             //   mailMsg.Priority = System.Net.Mail.MailPriority.High;
                foreach (var item in AddAttachment())
                {
                    mailMsg.Attachments.Add(item);
                }
                SmtpClient client = new SmtpClient();
                client.Host = textServer.Text;
                client.Port = 587;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.Credentials = new System.Net.NetworkCredential(textFrom.Text, textPasswd.Text);
                client.EnableSsl = true;
                client.Send(mailMsg);

                MessageBox.Show("Mail Send Success！", "Info", MessageBoxButtons.OK, MessageBoxIcon.Information);
                textLog.Text = "";
            }
            catch (Exception m) //异常处理
            {
                textLog.Text = m.Message;
                MessageBox.Show(m.Message);
            }

        }
        

        private void ButtonClear_Click(object sender, EventArgs e)
        {
            this.textAttachment.Text = "";
        }
    }
}
