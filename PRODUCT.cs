using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace POS_MOBILE
{
    public partial class PRODUCT : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection conn;
        string showmessage = "";
        string querry = "";
        string clickedbtn = "";
        private Form currentchildform;

        public PRODUCT()
        {
            InitializeComponent();
        }

        private void PRODUCT_Load(object sender, EventArgs e)
        {

        }

        private void mobilebtn_Click(object sender, EventArgs e)
        {
            
                clickedbtn = "Mobile";
                OpenchildForm(new MOBILE(clickedbtn));
                
            
        }

        private void accesoriesbtn_Click(object sender, EventArgs e)
        {
           
                
                clickedbtn = "Accessories";
                OpenchildForm(new ACCESSORIES(clickedbtn));
            
        }

        private void easypaisabtn_Click(object sender, EventArgs e)
        {
            
                
                clickedbtn = "EasyPaisa";
                //OpenchildForm(new ());
            
        }

        private void repairbtn_Click(object sender, EventArgs e)
        {
            
               
                clickedbtn = "Repairing";
                OpenchildForm(new REPAIRING());
            
        }

        private void OpenchildForm(Form childform)
        {
            if (currentchildform != null)
            {
                currentchildform.Close();
            }
            currentchildform = childform;
            childform.TopLevel = false;
            childform.FormBorderStyle = FormBorderStyle.None;
            childform.Dock = DockStyle.Fill;
            panelform.Controls.Add(childform);
            panelform.Tag = childform;
            childform.BringToFront();
            childform.Show();
            //chklbl.Text = childform.Text;
        }

        private void panel4_Paint(object sender, PaintEventArgs e)
        {

        }

        private void redobtn_Click(object sender, EventArgs e)
        {
            if (currentchildform != null)
            {
                currentchildform.Close();
            }
        }
    }
}
