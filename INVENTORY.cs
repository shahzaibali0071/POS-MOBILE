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
    public partial class INVENTORY : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection conn;
        string showmessage = "";
        string querry = "";
        string value;
        public INVENTORY()
        {
            InitializeComponent();
        }

        private void mobilebtn_Click(object sender, EventArgs e)
        {
            clicklbl.Text = "MOBILE";
            radioButton2.Text = "COMPANY";
            radioButton1.Text = "MODEL";
            radioButton1.Checked = true;
            querry = "select MOB_ID,  COMPANY, SERIES, MODEL, SELL PRICE, IMEI1, IMEI2, COLOR, PTA from MOBILE order by mob_ID asc";
            dgvpop(querry);
            CLEARVAL();

        }

        private void accesoriesbtn_Click(object sender, EventArgs e)
        {
            radioButton2.Text = "NAME";
            radioButton1.Text = "MODEL";
            radioButton1.Checked = true;
            clicklbl.Text = "ACCESSORIES";
            querry = "select ACC_ID, CATEGORY, NAME, MODEL, SELL PRICE , BRAND, SUPPLIER, QUANTITY from Accessories order by ACC_ID asc";
            dgvpop(querry);
            CLEARVAL();
        }

        private void easyloadbtn_Click(object sender, EventArgs e)
        {
            querry = "select * from easyload";
            dgvpop(querry);
            CLEARVAL();
        }

        private void easypaisabtn_Click(object sender, EventArgs e)
        {
            querry = "select * from easypaisa";
            dgvpop(querry);
        }

        private void repairbtn_Click(object sender, EventArgs e)
        {
            radioButton2.Text = "MODEL";
            radioButton1.Text = "ITEM";
            radioButton1.Checked = true;
            clicklbl.Text = "REPAIR";
            querry = "select REP_ID, ITEM, NAME, MODEL, SELL PRICE, QUALITY, QUANTITY from repair";
            dgvpop(querry);
            CLEARVAL();
        }

        private void INVENTORY_Load(object sender, EventArgs e)
        {
            
        }

        private void dgvpop( string table)
        {
            try
            {
                conn = new SqlConnection(ConnectionString);
                conn.Open();

                SqlDataAdapter adapter = new SqlDataAdapter(table , conn);
                DataTable dt = new DataTable();
                adapter.Fill(dt);
                invdgv.DataSource = dt;

                conn.Close();
            }
            catch(Exception e)
            {
                MessageBox.Show(e.Message);
            }
            
        }

        private void SERACHTXT_TextChanged(object sender, EventArgs e)
        {
            try
            {
                if(clicklbl.Text=="MOBILE")
                {
                    
                    if(radioButton1.Checked==true)
                    {
                        value = "select MOB_ID,  COMPANY, SERIES, MODEL, SELL PRICE, IMEI1, IMEI2, COLOR, PTA from " + clicklbl.Text + " where MODEL like '%" + SERACHTXT.Text + "%'";
                        dgvpop(value);
                    }
                    else
                        if(radioButton2.Checked == true)
                    {
                        value = "select MOB_ID,  COMPANY, SERIES, MODEL, SELL PRICE ,IMEI1, IMEI2, COLOR, PTA from " + clicklbl.Text + " where COMPANY like '%" + SERACHTXT.Text + "%'";
                        dgvpop(value);
                    }
                    
                }else
                if (clicklbl.Text == "ACCESSORIES")
                {
                    if (radioButton1.Checked == true)
                    {
                        value = "select ACC_ID, CATEGORY, NAME, MODEL, SELL PRICE, BRAND, SUPPLIER, QUANTITY from " + clicklbl.Text + " where MODEL like '%" + SERACHTXT.Text + "%'";
                        dgvpop(value);
                    }
                    else
                        if (radioButton2.Checked == true)
                    {
                        value = "select ACC_ID, CATEGORY, NAME, MODEL, SELL PRICE, BRAND, SUPPLIER, QUANTITY from " + clicklbl.Text + " where NAME like '%" + SERACHTXT.Text + "%'";
                        dgvpop(value);
                    }
                   
                }
                else
                if (clicklbl.Text == "REPAIR")
                {
                    if (radioButton1.Checked == true)
                    {
                        value = "select rep_id, item, name, SELL PRICE, model, quality from " + clicklbl.Text + " where ITEM like '%" + SERACHTXT.Text + "%'";
                        dgvpop(value);
                    }
                    else
                       if (radioButton2.Checked == true)
                    {
                        value = "select rep_id, item, name, SELL PRICE, model, quality from " + clicklbl.Text + " where MODEL like '%" + SERACHTXT.Text + "%'";
                        dgvpop(value);
                    }
                  
                }
                else
                {
                    MessageBox.Show("PLZ CLICK YOUR SELECTED FIELD LIKE MOBILE ETC");
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
       
        private void CLEARVAL()
        {
            SERACHTXT.Text = "";
            SERACHTXT.Focus();

        }
    }
}
