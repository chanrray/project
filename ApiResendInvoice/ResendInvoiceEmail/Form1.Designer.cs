namespace ResendInvoiceEmail
{
    partial class Form1
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.TextBox_num = new System.Windows.Forms.TextBox();
            this.label_num = new System.Windows.Forms.Label();
            this.button_send = new System.Windows.Forms.Button();
            this.label_domain = new System.Windows.Forms.Label();
            this.label_ip = new System.Windows.Forms.Label();
            this.label_apiurl = new System.Windows.Forms.Label();
            this.textBox_domain = new System.Windows.Forms.TextBox();
            this.textBox_ip = new System.Windows.Forms.TextBox();
            this.textBox_apiurl = new System.Windows.Forms.TextBox();
            this.text_log = new System.Windows.Forms.TextBox();
            this.label_log = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // TextBox_num
            // 
            this.TextBox_num.Location = new System.Drawing.Point(26, 149);
            this.TextBox_num.Multiline = true;
            this.TextBox_num.Name = "TextBox_num";
            this.TextBox_num.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.TextBox_num.Size = new System.Drawing.Size(229, 289);
            this.TextBox_num.TabIndex = 0;
            // 
            // label_num
            // 
            this.label_num.AutoSize = true;
            this.label_num.Location = new System.Drawing.Point(24, 122);
            this.label_num.Name = "label_num";
            this.label_num.Size = new System.Drawing.Size(137, 24);
            this.label_num.TabIndex = 1;
            this.label_num.Text = "请输入需要重发的订单号\r\n多个单号用回车换行";
            // 
            // button_send
            // 
            this.button_send.Location = new System.Drawing.Point(289, 285);
            this.button_send.Name = "button_send";
            this.button_send.Size = new System.Drawing.Size(133, 23);
            this.button_send.TabIndex = 2;
            this.button_send.Text = "发送请求";
            this.button_send.UseVisualStyleBackColor = true;
            this.button_send.Click += new System.EventHandler(this.Button_send_Click);
            // 
            // label_domain
            // 
            this.label_domain.AutoSize = true;
            this.label_domain.Location = new System.Drawing.Point(24, 59);
            this.label_domain.Name = "label_domain";
            this.label_domain.Size = new System.Drawing.Size(29, 12);
            this.label_domain.TabIndex = 3;
            this.label_domain.Text = "域名";
            // 
            // label_ip
            // 
            this.label_ip.AutoSize = true;
            this.label_ip.Location = new System.Drawing.Point(238, 59);
            this.label_ip.Name = "label_ip";
            this.label_ip.Size = new System.Drawing.Size(17, 12);
            this.label_ip.TabIndex = 4;
            this.label_ip.Text = "IP";
            // 
            // label_apiurl
            // 
            this.label_apiurl.AutoSize = true;
            this.label_apiurl.Location = new System.Drawing.Point(458, 41);
            this.label_apiurl.Name = "label_apiurl";
            this.label_apiurl.Size = new System.Drawing.Size(155, 12);
            this.label_apiurl.TabIndex = 5;
            this.label_apiurl.Text = "包含http(s)完整的接口地址";
            // 
            // textBox_domain
            // 
            this.textBox_domain.Location = new System.Drawing.Point(59, 56);
            this.textBox_domain.Name = "textBox_domain";
            this.textBox_domain.Size = new System.Drawing.Size(136, 21);
            this.textBox_domain.TabIndex = 6;
            // 
            // textBox_ip
            // 
            this.textBox_ip.Location = new System.Drawing.Point(268, 56);
            this.textBox_ip.Name = "textBox_ip";
            this.textBox_ip.Size = new System.Drawing.Size(154, 21);
            this.textBox_ip.TabIndex = 7;
            // 
            // textBox_apiurl
            // 
            this.textBox_apiurl.Location = new System.Drawing.Point(460, 56);
            this.textBox_apiurl.Name = "textBox_apiurl";
            this.textBox_apiurl.Size = new System.Drawing.Size(307, 21);
            this.textBox_apiurl.TabIndex = 8;
            // 
            // text_log
            // 
            this.text_log.Location = new System.Drawing.Point(460, 149);
            this.text_log.Multiline = true;
            this.text_log.Name = "text_log";
            this.text_log.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.text_log.Size = new System.Drawing.Size(307, 289);
            this.text_log.TabIndex = 9;
            // 
            // label_log
            // 
            this.label_log.AutoSize = true;
            this.label_log.Location = new System.Drawing.Point(458, 134);
            this.label_log.Name = "label_log";
            this.label_log.Size = new System.Drawing.Size(77, 12);
            this.label_log.TabIndex = 10;
            this.label_log.Text = "返回结果日志";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.label_log);
            this.Controls.Add(this.text_log);
            this.Controls.Add(this.textBox_apiurl);
            this.Controls.Add(this.textBox_ip);
            this.Controls.Add(this.textBox_domain);
            this.Controls.Add(this.label_apiurl);
            this.Controls.Add(this.label_ip);
            this.Controls.Add(this.label_domain);
            this.Controls.Add(this.button_send);
            this.Controls.Add(this.label_num);
            this.Controls.Add(this.TextBox_num);
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox TextBox_num;
        private System.Windows.Forms.Label label_num;
        private System.Windows.Forms.Button button_send;
        private System.Windows.Forms.Label label_domain;
        private System.Windows.Forms.Label label_ip;
        private System.Windows.Forms.Label label_apiurl;
        private System.Windows.Forms.TextBox textBox_domain;
        private System.Windows.Forms.TextBox textBox_ip;
        private System.Windows.Forms.TextBox textBox_apiurl;
        private System.Windows.Forms.TextBox text_log;
        private System.Windows.Forms.Label label_log;
    }
}

