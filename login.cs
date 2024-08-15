using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace POS_MOBILE
{
    public partial class login : Form
    {
        public static string SetValueForText1 = "";
        public login()
        {
            InitializeComponent();
        }

        private void login_Load(object sender, EventArgs e)
        {
            this.KeyPreview = true;
            if (usertxt.Text=="")
            { 
            usertxt.Focus();
            }
            timer1.Start();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            DateTime datetime = DateTime.Now;
            labeltime.Text = datetime.ToString("T");
            labeldate.Text = datetime.ToString("D");
        }

        private void exit_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void loginbtn_Click(object sender, EventArgs e)
        {
            
            if(usertxt.Text=="")
            {
                usertxt.Focus();
                warninglbl.Text = "ENTER USERNAME";
                warninglbl.ForeColor = Color.Red;
            }
            else if(passtxt.Text == "")
            {
                passtxt.Focus();
                warninglbl.Text = "ENTER PASSSWORD";
                warninglbl.ForeColor = Color.Red;
            }
            else
            if(usertxt.Text == "ali" && passtxt.Text == "ali123")
            {
                warninglbl.Hide();
                MessageBox.Show("welcome");
                this.Hide();
                SetValueForText1 = usertxt.Text;
                
                Mian frm = new Mian();
                frm.Show();

            }
            else
            {
                MessageBox.Show("INVALID... USERNAME OR PASSWORD");
                usertxt.Focus();
            }
        }

        private void login_KeyDown(object sender, KeyEventArgs e)
        {
            if ( e.KeyCode == Keys.Enter)
            {
                loginbtn.PerformClick();
            }
        }

        private void labeltime_Click(object sender, EventArgs e)
        {

        }

        private void labeldate_Click(object sender, EventArgs e)
        {

        }
    }
}
