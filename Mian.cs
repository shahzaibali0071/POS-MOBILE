using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using FontAwesome.Sharp;

namespace POS_MOBILE
{
    public partial class Mian : Form
    {
        private IconButton currentbtn;
        private Panel leftborderbtn;
        private Form currentchildform;
        public Mian()
        {
            InitializeComponent();
            leftborderbtn = new Panel();
            leftborderbtn.Size = new Size(7, 100);
            panelmanu.Controls.Add(leftborderbtn);
        }

        private struct RGBColors
        {
            public static Color color1 = Color.FromArgb(172, 126, 241);
            public static Color color2 = Color.FromArgb(249, 116, 176);
            public static Color color3 = Color.FromArgb(253, 138, 114);
            public static Color color4 = Color.FromArgb(95, 77, 221);
            public static Color color5 = Color.FromArgb(249, 88, 155);
            public static Color color6 = Color.FromArgb(24, 161, 251);
            public static Color color7 = Color.FromArgb(121, 161, 251);
            public static Color color8 = Color.FromArgb(151, 171, 241);
        }

        private void menubtn_Click(object sender, EventArgs e)
        {
            collapsemenu();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            userlbl.Text = login.SetValueForText1;
            
            this.KeyPreview = true;

            collapsemenu();

            timer1.Start();

            FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            Left = Top = 0;

            Width = Screen.PrimaryScreen.WorkingArea.Width;
            Height = Screen.PrimaryScreen.WorkingArea.Height;

        }

        private void Form1_KeyDown(object sender, KeyEventArgs e)
        {
            if(e.Control == true && e.KeyCode == Keys.H)
            {
                home.PerformClick();
            }
            if (e.Control == true && e.KeyCode == Keys.R)
            {
                recipt.PerformClick();
            }
            if (e.Control == true && e.KeyCode == Keys.I)
            {
                inventory.PerformClick();
            }
            if (e.Control == true && e.KeyCode == Keys.A)
            {
                admin.PerformClick();
            }
            if (e.Control == true && e.KeyCode == Keys.C)
            {
                cutomer.PerformClick();
            }
            if (e.Control == true && e.KeyCode == Keys.P)
            {
                Product.PerformClick();
            }
            if (e.Control == true && e.KeyCode == Keys.S)
            {
                supplier.PerformClick();
            }
            if (e.Control == true && e.KeyCode == Keys.D)
            {
                iconButton3.PerformClick();
            }
            if (e.Control == true && e.KeyCode == Keys.Space)
            {
                menubtn.PerformClick();
            }
            if (e.KeyCode == Keys.Escape)
            {
                reset.PerformClick();
            }

        }

        private void ActivateButton(Object sender, Color color)
        {
            if(sender!=null)
            {
                DisableButton();
                
                currentbtn = (IconButton)sender;
                currentbtn.BackColor = Color.FromArgb(38, 37, 82);
                currentbtn.ForeColor = color;
                currentbtn.TextAlign = ContentAlignment.MiddleLeft;
                currentbtn.IconColor = color;
                currentbtn.TextImageRelation = TextImageRelation.ImageBeforeText;
               // currentbtn.ImageAlign = ContentAlignment.MiddleLeft;
                iconchildform.IconChar = currentbtn.IconChar;
                
                iconchildform.IconColor = color;
                chklbl.ForeColor = color;
                
                //left side panel small
                if(panelmanu.Width==225)
                {
                    leftborderbtn.BackColor = color;
                    leftborderbtn.Location = new Point(0, currentbtn.Location.Y);
                    leftborderbtn.Visible = true;
                    leftborderbtn.BringToFront();
                    currentbtn.ImageAlign = ContentAlignment.MiddleCenter;
                }
                else { 
                leftborderbtn.BackColor = color;
                leftborderbtn.Location = new Point(0, currentbtn.Location.Y);
                leftborderbtn.Visible = true;
                leftborderbtn.BringToFront();
                currentbtn.ImageAlign = ContentAlignment.MiddleLeft;
                }
            }
        }

        private void DisableButton()
        {
            if (currentbtn != null)
            {
                
                currentbtn.BackColor = Color.FromArgb(34, 33, 74);
                currentbtn.ForeColor = Color.White;
                currentbtn.TextAlign = ContentAlignment.MiddleLeft;
                currentbtn.IconColor = Color.White;
                currentbtn.TextImageRelation = TextImageRelation.ImageBeforeText;
                
                if(panelmanu.Width==225)
                {
                    currentbtn.ImageAlign = ContentAlignment.MiddleCenter;
                }
                else
                {
                    currentbtn.ImageAlign = ContentAlignment.MiddleLeft;
                }
            }
        }

        private void collapsemenu()
        {
            if (this.panelmanu.Width > 400)
            {
                panelmanu.Width = 225;
                label1.Visible = false;
                label2.Visible = false;
                // pictureBox1.Visible = false;
                reset.Width = 100;
                reset.Dock = DockStyle.Top;
                reset.Height = 140;
                menubtn.Dock = DockStyle.Bottom;
                foreach (Button menuButton in panelmanu.Controls.OfType<Button>())
                {
                    menuButton.Text = "";
                    menuButton.ImageAlign = ContentAlignment.MiddleCenter;
                    menuButton.Padding = new Padding(0, 15, 0, 0);


                }
            }
            else
            {
                panelmanu.Width = 450;
                label1.Visible = true;
                label2.Visible = true;
                reset.Dock = DockStyle.Left;
                reset.Width = 150;
                //pictureBox1.Visible = true;
                menubtn.Dock = DockStyle.None;
                foreach (Button menuButton in panelmanu.Controls.OfType<Button>())
                {
                    menuButton.Text = "   " + menuButton.Tag.ToString();
                    menuButton.ImageAlign = ContentAlignment.MiddleLeft;
                    menuButton.Padding = new Padding(15, 0, 0, 0);


                }
            }
        }
       
        private void home_Click(object sender, EventArgs e)
        {
            
            ActivateButton(sender,RGBColors.color1);
            chklbl.Text = "HOME";
            OpenchildForm(new HOME());
        }

        private void recipt_Click(object sender, EventArgs e)
        {
            
            ActivateButton(sender, RGBColors.color2);
            chklbl.Text = "RECIPT";
            OpenchildForm(new Billdesign());
        }

        private void inventory_Click(object sender, EventArgs e)
        {
            
            ActivateButton(sender, RGBColors.color3);
            chklbl.Text = "INVENTORY";
            OpenchildForm(new INVENTORY());
        }

        private void admin_Click(object sender, EventArgs e)
        {
            
            ActivateButton(sender, RGBColors.color4);
            chklbl.Text = "PURCHASE";
            OpenchildForm(new PURCHASES());
        }

        private void cutomer_Click(object sender, EventArgs e)
        {
            
            if (userlbl.Text == "ali")
            {
                ActivateButton(sender, RGBColors.color5);
                chklbl.Text = "CUSTOMER";
                OpenchildForm(new CUSTOMER());
            }
            else
            {
                MessageBox.Show("Sorry plz login as admin to proceed !!!");

            }

        }

        private void supplier_Click(object sender, EventArgs e)
        {
            if (userlbl.Text == "ali")
            {
                ActivateButton(sender, RGBColors.color6);
                chklbl.Text = "SUPPLIER";
                OpenchildForm(new SUPPLIER());
            }
            else
            {
                MessageBox.Show("Sorry plz login as admin to proceed !!!");

            }
            
        }

        private void Product_Click(object sender, EventArgs e)
        {
            //string userauthentication = "";
            if(userlbl.Text ==  "ali")
            {
                ActivateButton(sender, RGBColors.color7);
                chklbl.Text = "PRODUCT";
                OpenchildForm(new PRODUCT());
            }else
            {
                MessageBox.Show("Sorry plz login as admin to proceed !!!");

            }
            //ActivateButton(sender, RGBColors.color7);
            //chklbl.Text = "PRODUCT";
            //OpenchildForm(new PRODUCT());
        }

        private void reset_Click(object sender, EventArgs e)
        {
            resetapp();
            currentchildform.Close();
        }

        private void resetapp()
        {
            DisableButton();
            leftborderbtn.Visible = false;
            chklbl.Text = "HOME";
            iconchildform.IconChar = IconChar.Home;
            
        }

        private void timer1_Tick_1(object sender, EventArgs e)
        {
            DateTime datetime = DateTime.Now;
            labeltime.Text = datetime.ToString("T");
            labeldate.Text = datetime.ToString("D");
        }

        private void logoutbtn_Click(object sender, EventArgs e)
        {
            this.Close();
            login log = new login();
            log.Show();

        }

        private void exit_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void iconButton2_Click(object sender, EventArgs e)
        {
            WindowState = FormWindowState.Minimized;
        }

        private void maximum_Click(object sender, EventArgs e)
        {
            //if (this.WindowState == FormWindowState.Normal)
            //{
            //    this.WindowState = FormWindowState.Maximized;

            //}
            //else
            //{
            //    this.WindowState = FormWindowState.Normal;
            //}
        }

        private void OpenchildForm (Form childform)
        {
            if(currentchildform!=null)
            {
                currentchildform.Close();
            }
            currentchildform = childform;
            childform.TopLevel = false;
            childform.FormBorderStyle = FormBorderStyle.None;
            childform.Dock = DockStyle.Fill;
            paneldesk.Controls.Add(childform);
            paneldesk.Tag = childform;
            childform.BringToFront();
            childform.Show();
            chklbl.Text = childform.Text;
        }

        private void iconButton3_Click(object sender, EventArgs e)
        {
            if (userlbl.Text == "ali")
            {
                ActivateButton(sender, RGBColors.color8);
                chklbl.Text = "DEMAND";
                OpenchildForm(new DEMAND());
            }
            else
            {
                MessageBox.Show("Sorry plz login as admin to proceed !!!");

            }
        }

        private void labeltime_Click(object sender, EventArgs e)
        {

        }
    }
}
