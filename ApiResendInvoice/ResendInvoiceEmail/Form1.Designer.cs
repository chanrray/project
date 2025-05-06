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
            this.TextBox1 = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.label_domain = new System.Windows.Forms.Label();
            this.label_ip = new System.Windows.Forms.Label();
            this.label_apiurl = new System.Windows.Forms.Label();
            this.textBox_domain = new System.Windows.Forms.TextBox();
            this.textBox_ip = new System.Windows.Forms.TextBox();
            this.textBox_apiurl = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // TextBox1
            // 
            this.TextBox1.Location = new System.Drawing.Point(278, 188);
            this.TextBox1.Multiline = true;
            this.TextBox1.Name = "TextBox1";
            this.TextBox1.Size = new System.Drawing.Size(229, 250);
            this.TextBox1.TabIndex = 0;
            this.TextBox1.TextChanged += new System.EventHandler(this.TextBox1_TextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(24, 249);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(185, 24);
            this.label1.TabIndex = 1;
            this.label1.Text = "请输入需要重发发票邮件的订单号\r\n多个单号用回车换行";
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(581, 244);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(133, 23);
            this.button1.TabIndex = 2;
            this.button1.Text = "发送重发请求";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.Button1_Click);
            // 
            // label_domain
            // 
            this.label_domain.AutoSize = true;
            this.label_domain.Location = new System.Drawing.Point(24, 74);
            this.label_domain.Name = "label_domain";
            this.label_domain.Size = new System.Drawing.Size(29, 12);
            this.label_domain.TabIndex = 3;
            this.label_domain.Text = "域名";
            this.label_domain.Click += new System.EventHandler(this.label2_Click);
            // 
            // label_ip
            // 
            this.label_ip.AutoSize = true;
            this.label_ip.Location = new System.Drawing.Point(276, 74);
            this.label_ip.Name = "label_ip";
            this.label_ip.Size = new System.Drawing.Size(17, 12);
            this.label_ip.TabIndex = 4;
            this.label_ip.Text = "IP";
            // 
            // label_apiurl
            // 
            this.label_apiurl.AutoSize = true;
            this.label_apiurl.Location = new System.Drawing.Point(516, 77);
            this.label_apiurl.Name = "label_apiurl";
            this.label_apiurl.Size = new System.Drawing.Size(47, 12);
            this.label_apiurl.TabIndex = 5;
            this.label_apiurl.Text = "API_URL";
            // 
            // textBox_domain
            // 
            this.textBox_domain.Location = new System.Drawing.Point(73, 71);
            this.textBox_domain.Name = "textBox_domain";
            this.textBox_domain.Size = new System.Drawing.Size(136, 21);
            this.textBox_domain.TabIndex = 6;
            // 
            // textBox_ip
            // 
            this.textBox_ip.Location = new System.Drawing.Point(315, 71);
            this.textBox_ip.Name = "textBox_ip";
            this.textBox_ip.Size = new System.Drawing.Size(154, 21);
            this.textBox_ip.TabIndex = 7;
            // 
            // textBox_apiurl
            // 
            this.textBox_apiurl.Location = new System.Drawing.Point(581, 74);
            this.textBox_apiurl.Name = "textBox_apiurl";
            this.textBox_apiurl.Size = new System.Drawing.Size(207, 21);
            this.textBox_apiurl.TabIndex = 8;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.textBox_apiurl);
            this.Controls.Add(this.textBox_ip);
            this.Controls.Add(this.textBox_domain);
            this.Controls.Add(this.label_apiurl);
            this.Controls.Add(this.label_ip);
            this.Controls.Add(this.label_domain);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.TextBox1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox TextBox1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Label label_domain;
        private System.Windows.Forms.Label label_ip;
        private System.Windows.Forms.Label label_apiurl;
        private System.Windows.Forms.TextBox textBox_domain;
        private System.Windows.Forms.TextBox textBox_ip;
        private System.Windows.Forms.TextBox textBox_apiurl;
    }
}

