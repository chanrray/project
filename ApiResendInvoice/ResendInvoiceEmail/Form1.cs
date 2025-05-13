using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace ResendInvoiceEmail
{
    public partial class Form1 : Form
    {
        private readonly HttpClient _httpClient;
        public Form1()
        {
            InitializeComponent();
            textBox_domain.Text = "api.prod.vmb";
            textBox_ip.Text = "192.168.100.116";
            textBox_apiurl.Text = "请输入完整的apiurl";
            // 创建自定义HttpClient，强制将域名解析到指定IP
            _httpClient = new HttpClient(new CustomDnsHandler(textBox_domain.Text.Trim(), textBox_ip.Text.Trim()));
        }
        private async void Button_send_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(TextBox_num.Text))
            {
                MessageBox.Show("请输入至少一个单号", "提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            // 禁用按钮以防止重复点击
            button_send.Enabled = false;
            // 添加一个标志来跟踪是否有失败的请求
            bool allSuccessful = true;
            try
            {
                // 获取所有单号（按行分割）
                var orderNumbers = TextBox_num.Text.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);

                // 用于收集所有结果的字符串
                var resultBuilder = new StringBuilder();

                // 依次处理每个单号
                foreach (var orderNumber in orderNumbers)
                {
                    if (string.IsNullOrWhiteSpace(orderNumber))
                        continue;

                    try
                    {
                        // 发送GET请求
                        var response = await _httpClient.GetAsync($"{textBox_apiurl.Text.Trim()}{orderNumber.Trim()}");

                        // 读取响应内容
                        var content = await response.Content.ReadAsStringAsync();

                        // 添加到结果中
                        resultBuilder.AppendLine($"单号: {orderNumber}");
                        resultBuilder.AppendLine($"响应: {content}");
                        resultBuilder.AppendLine("---------------------");
                    }
                    catch (Exception ex)
                    {
                        resultBuilder.AppendLine($"单号: {orderNumber} 请求失败");
                        resultBuilder.AppendLine($"错误: {ex.Message}");
                        resultBuilder.AppendLine("---------------------");
                        // 如果发生异常，设置标志为false
                        allSuccessful = false;
                    }
                }
                // 显示所有结果
                text_log.Text = resultBuilder.ToString();
                if (allSuccessful)
                {
                    MessageBox.Show("全部成功", "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    MessageBox.Show("注意失败", "提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            finally
            {
                button_send.Enabled = true;
            }
        }
        // 自定义HttpClientHandler，用于强制解析特定域名到指定IP
        public class CustomDnsHandler : HttpClientHandler
        {
            private readonly string _targetDomain;
            private readonly string _targetIp;

            public CustomDnsHandler(string targetDomain, string targetIp)
            {
                _targetDomain = targetDomain;
                _targetIp = targetIp;

                // 忽略证书验证（如果是HTTPS），暂时不需要此功能
                // this.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true;
            }

            protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
            {
                // 如果请求的域名是目标域名，则修改为指定IP
                if (request.RequestUri.Host.Equals(_targetDomain, StringComparison.OrdinalIgnoreCase))
                {
                    var builder = new UriBuilder(request.RequestUri)
                    {
                        Host = _targetIp
                    };
                    request.RequestUri = builder.Uri;

                    // 保持原始Host头，这对服务器识别虚拟主机很重要
                    request.Headers.Host = _targetDomain;
                }

                return base.SendAsync(request, cancellationToken);
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

    }
}
