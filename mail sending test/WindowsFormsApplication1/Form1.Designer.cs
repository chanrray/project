namespace WinFormsApp1
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
            this.buttonSend25 = new System.Windows.Forms.Button();
            this.buttonAttachment = new System.Windows.Forms.Button();
            this.textTo = new System.Windows.Forms.TextBox();
            this.textSubject = new System.Windows.Forms.TextBox();
            this.textBody = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.textAttachment = new System.Windows.Forms.TextBox();
            this.buttonSend465 = new System.Windows.Forms.Button();
            this.buttonSend587 = new System.Windows.Forms.Button();
            this.textFrom = new System.Windows.Forms.TextBox();
            this.textPasswd = new System.Windows.Forms.TextBox();
            this.textServer = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.textLog = new System.Windows.Forms.TextBox();
            this.buttonClear = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // buttonSend25
            // 
            this.buttonSend25.Location = new System.Drawing.Point(724, 31);
            this.buttonSend25.Name = "buttonSend25";
            this.buttonSend25.Size = new System.Drawing.Size(75, 23);
            this.buttonSend25.TabIndex = 0;
            this.buttonSend25.Text = "send25";
            this.buttonSend25.UseVisualStyleBackColor = true;
            this.buttonSend25.Click += new System.EventHandler(this.ButtonSend25_Click);
            // 
            // buttonAttachment
            // 
            this.buttonAttachment.Location = new System.Drawing.Point(686, 214);
            this.buttonAttachment.Name = "buttonAttachment";
            this.buttonAttachment.Size = new System.Drawing.Size(113, 23);
            this.buttonAttachment.TabIndex = 1;
            this.buttonAttachment.Text = "add attachment";
            this.buttonAttachment.UseVisualStyleBackColor = true;
            this.buttonAttachment.Click += new System.EventHandler(this.ButtonAttachment_Click);
            // 
            // textTo
            // 
            this.textTo.Location = new System.Drawing.Point(53, 72);
            this.textTo.Name = "textTo";
            this.textTo.Size = new System.Drawing.Size(270, 21);
            this.textTo.TabIndex = 3;
            // 
            // textSubject
            // 
            this.textSubject.Location = new System.Drawing.Point(53, 121);
            this.textSubject.Name = "textSubject";
            this.textSubject.Size = new System.Drawing.Size(270, 21);
            this.textSubject.TabIndex = 4;
            // 
            // textBody
            // 
            this.textBody.AcceptsReturn = true;
            this.textBody.Location = new System.Drawing.Point(53, 331);
            this.textBody.Multiline = true;
            this.textBody.Name = "textBody";
            this.textBody.Size = new System.Drawing.Size(405, 136);
            this.textBody.TabIndex = 5;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(6, 34);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(29, 12);
            this.label1.TabIndex = 6;
            this.label1.Text = "from";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(6, 75);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(17, 12);
            this.label2.TabIndex = 7;
            this.label2.Text = "to";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(6, 124);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(47, 12);
            this.label3.TabIndex = 8;
            this.label3.Text = "subject";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(6, 404);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(29, 12);
            this.label4.TabIndex = 9;
            this.label4.Text = "body";
            // 
            // textAttachment
            // 
            this.textAttachment.Location = new System.Drawing.Point(53, 162);
            this.textAttachment.Multiline = true;
            this.textAttachment.Name = "textAttachment";
            this.textAttachment.ReadOnly = true;
            this.textAttachment.Size = new System.Drawing.Size(623, 147);
            this.textAttachment.TabIndex = 10;
            // 
            // buttonSend465
            // 
            this.buttonSend465.Location = new System.Drawing.Point(724, 75);
            this.buttonSend465.Name = "buttonSend465";
            this.buttonSend465.Size = new System.Drawing.Size(75, 23);
            this.buttonSend465.TabIndex = 13;
            this.buttonSend465.Text = "send465";
            this.buttonSend465.UseVisualStyleBackColor = true;
            this.buttonSend465.Click += new System.EventHandler(this.ButtonSend465_Click);
            // 
            // buttonSend587
            // 
            this.buttonSend587.Location = new System.Drawing.Point(724, 124);
            this.buttonSend587.Name = "buttonSend587";
            this.buttonSend587.Size = new System.Drawing.Size(75, 23);
            this.buttonSend587.TabIndex = 14;
            this.buttonSend587.Text = "send587";
            this.buttonSend587.UseVisualStyleBackColor = true;
            this.buttonSend587.Click += new System.EventHandler(this.ButtonSend587_Click);
            // 
            // textFrom
            // 
            this.textFrom.Location = new System.Drawing.Point(53, 25);
            this.textFrom.Name = "textFrom";
            this.textFrom.Size = new System.Drawing.Size(270, 21);
            this.textFrom.TabIndex = 15;
            // 
            // textPasswd
            // 
            this.textPasswd.ForeColor = System.Drawing.SystemColors.WindowText;
            this.textPasswd.Location = new System.Drawing.Point(406, 25);
            this.textPasswd.Name = "textPasswd";
            this.textPasswd.Size = new System.Drawing.Size(270, 21);
            this.textPasswd.TabIndex = 16;
            // 
            // textServer
            // 
            this.textServer.Location = new System.Drawing.Point(406, 72);
            this.textServer.Name = "textServer";
            this.textServer.Size = new System.Drawing.Size(270, 21);
            this.textServer.TabIndex = 17;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(350, 31);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(41, 12);
            this.label5.TabIndex = 18;
            this.label5.Text = "passwd";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(350, 75);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(41, 12);
            this.label6.TabIndex = 19;
            this.label6.Text = "server";
            // 
            // textLog
            // 
            this.textLog.AcceptsReturn = true;
            this.textLog.Location = new System.Drawing.Point(473, 331);
            this.textLog.Multiline = true;
            this.textLog.Name = "textLog";
            this.textLog.Size = new System.Drawing.Size(361, 136);
            this.textLog.TabIndex = 20;
            // 
            // buttonClear
            // 
            this.buttonClear.Location = new System.Drawing.Point(686, 286);
            this.buttonClear.Name = "buttonClear";
            this.buttonClear.Size = new System.Drawing.Size(113, 23);
            this.buttonClear.TabIndex = 21;
            this.buttonClear.Text = "clear attachment";
            this.buttonClear.UseVisualStyleBackColor = true;
            this.buttonClear.Click += new System.EventHandler(this.ButtonClear_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(846, 479);
            this.Controls.Add(this.buttonClear);
            this.Controls.Add(this.textLog);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.textServer);
            this.Controls.Add(this.textPasswd);
            this.Controls.Add(this.textFrom);
            this.Controls.Add(this.buttonSend587);
            this.Controls.Add(this.buttonSend465);
            this.Controls.Add(this.textAttachment);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.textBody);
            this.Controls.Add(this.textSubject);
            this.Controls.Add(this.textTo);
            this.Controls.Add(this.buttonAttachment);
            this.Controls.Add(this.buttonSend25);
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button buttonSend25;
        private System.Windows.Forms.Button buttonAttachment;
        private System.Windows.Forms.TextBox textTo;
        private System.Windows.Forms.TextBox textSubject;
        private System.Windows.Forms.TextBox textBody;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox textAttachment;
        private System.Windows.Forms.Button buttonSend465;
        private System.Windows.Forms.Button buttonSend587;
        private System.Windows.Forms.TextBox textFrom;
        private System.Windows.Forms.TextBox textPasswd;
        private System.Windows.Forms.TextBox textServer;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TextBox textLog;
        private System.Windows.Forms.Button buttonClear;
    }
}

