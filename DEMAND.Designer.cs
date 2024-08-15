
namespace POS_MOBILE
{
    partial class DEMAND
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle13 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle14 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle15 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle16 = new System.Windows.Forms.DataGridViewCellStyle();
            this.demdgv = new System.Windows.Forms.DataGridView();
            this.deminstructiontxt = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.demqtytxt = new System.Windows.Forms.TextBox();
            this.qty = new System.Windows.Forms.Label();
            this.demdescriptiontxt = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.demid = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.panel2 = new System.Windows.Forms.Panel();
            this.panel1 = new System.Windows.Forms.Panel();
            this.label3 = new System.Windows.Forms.Label();
            this.demlistcombo = new System.Windows.Forms.ComboBox();
            this.clear = new FontAwesome.Sharp.IconButton();
            this.demdeletebtn = new FontAwesome.Sharp.IconButton();
            this.demupdatebtn = new FontAwesome.Sharp.IconButton();
            this.demsavebtn = new FontAwesome.Sharp.IconButton();
            ((System.ComponentModel.ISupportInitialize)(this.demdgv)).BeginInit();
            this.panel2.SuspendLayout();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // demdgv
            // 
            this.demdgv.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.demdgv.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.DisplayedCells;
            this.demdgv.BackgroundColor = System.Drawing.SystemColors.ButtonHighlight;
            this.demdgv.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.demdgv.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            dataGridViewCellStyle13.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle13.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle13.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.875F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic))), System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle13.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle13.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle13.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle13.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.demdgv.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle13;
            this.demdgv.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            dataGridViewCellStyle14.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle14.BackColor = System.Drawing.SystemColors.Window;
            dataGridViewCellStyle14.Font = new System.Drawing.Font("Kristen ITC", 10.125F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic))), System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle14.ForeColor = System.Drawing.SystemColors.ControlText;
            dataGridViewCellStyle14.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle14.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle14.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.demdgv.DefaultCellStyle = dataGridViewCellStyle14;
            this.demdgv.Dock = System.Windows.Forms.DockStyle.Fill;
            this.demdgv.GridColor = System.Drawing.SystemColors.GradientInactiveCaption;
            this.demdgv.Location = new System.Drawing.Point(0, 0);
            this.demdgv.Name = "demdgv";
            dataGridViewCellStyle15.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle15.BackColor = System.Drawing.SystemColors.GradientInactiveCaption;
            dataGridViewCellStyle15.Font = new System.Drawing.Font("Microsoft Sans Serif", 7.875F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle15.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle15.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle15.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle15.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.demdgv.RowHeadersDefaultCellStyle = dataGridViewCellStyle15;
            this.demdgv.RowHeadersWidth = 82;
            dataGridViewCellStyle16.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle16.BackColor = System.Drawing.Color.PapayaWhip;
            dataGridViewCellStyle16.ForeColor = System.Drawing.Color.Black;
            dataGridViewCellStyle16.SelectionBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(128)))), ((int)(((byte)(128)))), ((int)(((byte)(255)))));
            dataGridViewCellStyle16.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.demdgv.RowsDefaultCellStyle = dataGridViewCellStyle16;
            this.demdgv.RowTemplate.Height = 33;
            this.demdgv.Size = new System.Drawing.Size(1888, 1329);
            this.demdgv.TabIndex = 1;
            this.demdgv.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.demdgv_CellClick);
            // 
            // deminstructiontxt
            // 
            this.deminstructiontxt.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.deminstructiontxt.BackColor = System.Drawing.SystemColors.GradientInactiveCaption;
            this.deminstructiontxt.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.deminstructiontxt.Font = new System.Drawing.Font("Microsoft Sans Serif", 44F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Pixel, ((byte)(0)));
            this.deminstructiontxt.Location = new System.Drawing.Point(66, 710);
            this.deminstructiontxt.Multiline = true;
            this.deminstructiontxt.Name = "deminstructiontxt";
            this.deminstructiontxt.Size = new System.Drawing.Size(551, 354);
            this.deminstructiontxt.TabIndex = 4;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(24, 654);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(459, 44);
            this.label2.TabIndex = 49;
            this.label2.Text = "INSTRUCTIONS (if any) : ";
            // 
            // demqtytxt
            // 
            this.demqtytxt.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.demqtytxt.BackColor = System.Drawing.SystemColors.GradientInactiveCaption;
            this.demqtytxt.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.demqtytxt.Font = new System.Drawing.Font("Microsoft Sans Serif", 44F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Pixel, ((byte)(0)));
            this.demqtytxt.Location = new System.Drawing.Point(66, 389);
            this.demqtytxt.Name = "demqtytxt";
            this.demqtytxt.Size = new System.Drawing.Size(551, 57);
            this.demqtytxt.TabIndex = 1;
            // 
            // qty
            // 
            this.qty.AutoSize = true;
            this.qty.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.qty.Location = new System.Drawing.Point(24, 328);
            this.qty.Name = "qty";
            this.qty.Size = new System.Drawing.Size(240, 44);
            this.qty.TabIndex = 47;
            this.qty.Text = "QUANTITY : ";
            // 
            // demdescriptiontxt
            // 
            this.demdescriptiontxt.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.demdescriptiontxt.BackColor = System.Drawing.SystemColors.GradientInactiveCaption;
            this.demdescriptiontxt.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.demdescriptiontxt.Font = new System.Drawing.Font("Microsoft Sans Serif", 44F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Pixel, ((byte)(0)));
            this.demdescriptiontxt.Location = new System.Drawing.Point(66, 224);
            this.demdescriptiontxt.Name = "demdescriptiontxt";
            this.demdescriptiontxt.Size = new System.Drawing.Size(551, 57);
            this.demdescriptiontxt.TabIndex = 0;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.Location = new System.Drawing.Point(24, 165);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(307, 44);
            this.label6.TabIndex = 8;
            this.label6.Text = "DESCRIPTION : ";
            // 
            // demid
            // 
            this.demid.AutoSize = true;
            this.demid.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.demid.Location = new System.Drawing.Point(233, 48);
            this.demid.Name = "demid";
            this.demid.Size = new System.Drawing.Size(125, 44);
            this.demid.TabIndex = 13;
            this.demid.Text = "00000";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(24, 48);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(193, 44);
            this.label1.TabIndex = 0;
            this.label1.Text = "DEM_ID : ";
            // 
            // panel2
            // 
            this.panel2.Controls.Add(this.demdgv);
            this.panel2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel2.Location = new System.Drawing.Point(646, 0);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(1888, 1329);
            this.panel2.TabIndex = 5;
            // 
            // panel1
            // 
            this.panel1.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.panel1.BackColor = System.Drawing.SystemColors.ButtonFace;
            this.panel1.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.panel1.Controls.Add(this.demlistcombo);
            this.panel1.Controls.Add(this.label3);
            this.panel1.Controls.Add(this.clear);
            this.panel1.Controls.Add(this.deminstructiontxt);
            this.panel1.Controls.Add(this.label2);
            this.panel1.Controls.Add(this.demqtytxt);
            this.panel1.Controls.Add(this.qty);
            this.panel1.Controls.Add(this.demdescriptiontxt);
            this.panel1.Controls.Add(this.demdeletebtn);
            this.panel1.Controls.Add(this.demupdatebtn);
            this.panel1.Controls.Add(this.demsavebtn);
            this.panel1.Controls.Add(this.label6);
            this.panel1.Controls.Add(this.demid);
            this.panel1.Controls.Add(this.label1);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Left;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(646, 1329);
            this.panel1.TabIndex = 4;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(24, 495);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(209, 44);
            this.label3.TabIndex = 69;
            this.label3.Text = "STATUS  : ";
            // 
            // demlistcombo
            // 
            this.demlistcombo.AutoCompleteMode = System.Windows.Forms.AutoCompleteMode.SuggestAppend;
            this.demlistcombo.AutoCompleteSource = System.Windows.Forms.AutoCompleteSource.ListItems;
            this.demlistcombo.BackColor = System.Drawing.SystemColors.GradientInactiveCaption;
            this.demlistcombo.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.demlistcombo.Font = new System.Drawing.Font("Microsoft Sans Serif", 44F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Pixel, ((byte)(0)));
            this.demlistcombo.FormattingEnabled = true;
            this.demlistcombo.Items.AddRange(new object[] {
            "PENDING",
            "AVAILABLE",
            "UNAVAILABLE"});
            this.demlistcombo.Location = new System.Drawing.Point(66, 554);
            this.demlistcombo.Name = "demlistcombo";
            this.demlistcombo.Size = new System.Drawing.Size(551, 60);
            this.demlistcombo.TabIndex = 70;
            this.demlistcombo.SelectedIndexChanged += new System.EventHandler(this.brandlistcombo_SelectedIndexChanged);
            // 
            // clear
            // 
            this.clear.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.clear.BackColor = System.Drawing.Color.MediumOrchid;
            this.clear.Font = new System.Drawing.Font("Microsoft Sans Serif", 8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.clear.ForeColor = System.Drawing.SystemColors.Window;
            this.clear.IconChar = FontAwesome.Sharp.IconChar.Redo;
            this.clear.IconColor = System.Drawing.Color.White;
            this.clear.IconFont = FontAwesome.Sharp.IconFont.Auto;
            this.clear.Location = new System.Drawing.Point(319, 1203);
            this.clear.Name = "clear";
            this.clear.Size = new System.Drawing.Size(300, 100);
            this.clear.TabIndex = 67;
            this.clear.Text = "CLEAR";
            this.clear.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageBeforeText;
            this.clear.UseVisualStyleBackColor = false;
            this.clear.Click += new System.EventHandler(this.clear_Click);
            // 
            // demdeletebtn
            // 
            this.demdeletebtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.demdeletebtn.BackColor = System.Drawing.Color.MediumVioletRed;
            this.demdeletebtn.Font = new System.Drawing.Font("Microsoft Sans Serif", 8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.demdeletebtn.ForeColor = System.Drawing.SystemColors.Window;
            this.demdeletebtn.IconChar = FontAwesome.Sharp.IconChar.Eraser;
            this.demdeletebtn.IconColor = System.Drawing.Color.White;
            this.demdeletebtn.IconFont = FontAwesome.Sharp.IconFont.Auto;
            this.demdeletebtn.Location = new System.Drawing.Point(11, 1203);
            this.demdeletebtn.Name = "demdeletebtn";
            this.demdeletebtn.Size = new System.Drawing.Size(300, 100);
            this.demdeletebtn.TabIndex = 7;
            this.demdeletebtn.Text = "DELETE";
            this.demdeletebtn.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageBeforeText;
            this.demdeletebtn.UseVisualStyleBackColor = false;
            this.demdeletebtn.Click += new System.EventHandler(this.demdeletebtn_Click);
            // 
            // demupdatebtn
            // 
            this.demupdatebtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.demupdatebtn.BackColor = System.Drawing.Color.SteelBlue;
            this.demupdatebtn.Font = new System.Drawing.Font("Microsoft Sans Serif", 8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.demupdatebtn.ForeColor = System.Drawing.SystemColors.Window;
            this.demupdatebtn.IconChar = FontAwesome.Sharp.IconChar.Upload;
            this.demupdatebtn.IconColor = System.Drawing.Color.White;
            this.demupdatebtn.IconFont = FontAwesome.Sharp.IconFont.Auto;
            this.demupdatebtn.Location = new System.Drawing.Point(317, 1097);
            this.demupdatebtn.Name = "demupdatebtn";
            this.demupdatebtn.Size = new System.Drawing.Size(300, 100);
            this.demupdatebtn.TabIndex = 6;
            this.demupdatebtn.Text = "UPDATE";
            this.demupdatebtn.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageBeforeText;
            this.demupdatebtn.UseVisualStyleBackColor = false;
            this.demupdatebtn.Click += new System.EventHandler(this.demupdatebtn_Click);
            // 
            // demsavebtn
            // 
            this.demsavebtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.demsavebtn.BackColor = System.Drawing.Color.RoyalBlue;
            this.demsavebtn.Font = new System.Drawing.Font("Microsoft Sans Serif", 8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.demsavebtn.ForeColor = System.Drawing.Color.White;
            this.demsavebtn.IconChar = FontAwesome.Sharp.IconChar.Save;
            this.demsavebtn.IconColor = System.Drawing.Color.White;
            this.demsavebtn.IconFont = FontAwesome.Sharp.IconFont.Auto;
            this.demsavebtn.Location = new System.Drawing.Point(11, 1097);
            this.demsavebtn.Name = "demsavebtn";
            this.demsavebtn.Size = new System.Drawing.Size(300, 100);
            this.demsavebtn.TabIndex = 5;
            this.demsavebtn.Text = "SAVE";
            this.demsavebtn.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageBeforeText;
            this.demsavebtn.UseVisualStyleBackColor = false;
            this.demsavebtn.Click += new System.EventHandler(this.demsavebtn_Click);
            // 
            // DEMAND
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(12F, 25F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(2534, 1329);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.panel1);
            this.Name = "DEMAND";
            this.Text = "DEMAND";
            this.Load += new System.EventHandler(this.DEMAND_Load);
            ((System.ComponentModel.ISupportInitialize)(this.demdgv)).EndInit();
            this.panel2.ResumeLayout(false);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.DataGridView demdgv;
        private FontAwesome.Sharp.IconButton clear;
        private System.Windows.Forms.TextBox deminstructiontxt;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox demqtytxt;
        private System.Windows.Forms.Label qty;
        private System.Windows.Forms.TextBox demdescriptiontxt;
        private FontAwesome.Sharp.IconButton demdeletebtn;
        private FontAwesome.Sharp.IconButton demupdatebtn;
        private FontAwesome.Sharp.IconButton demsavebtn;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label demid;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.ComboBox demlistcombo;
    }
}