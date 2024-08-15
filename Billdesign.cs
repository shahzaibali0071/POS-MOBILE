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
    public partial class Billdesign : Form
    {

        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection connect;
        string getproduct, getprice,getid, getstock,sp, CATEGORY;
        string[] listarr;
        public Billdesign()
        {
            InitializeComponent();
        }

        private void Billdesign_Load(object sender, EventArgs e)
        {
            previusdataGridView.Visible = false;
            CLEARVAL();
            fetchinvoice();
            NEWradioButton.Checked = true;
            FLATradioButton.Checked = true;
            CATcomboBox.Focus();
            get_cust();
            timer1.Start();
            EXPQTYcomboBox.SelectedIndex = 0;


        }
        

        private void PROADDBTN_Click(object sender, EventArgs e)
        {
            if (DISCOUNTTXT.Text != "")
            {
                if (PERCENTradioButton.Checked == true)
                {
                    PERAMTLBL.Text = ((int.Parse(DISCOUNTTXT.Text) * int.Parse(PRICETXT.Text)) / 100).ToString();
                    MessageBox.Show(PERAMTLBL.Text);
                    listarr = new string[6];
                    listarr[0] = IDTXT.Text;
                    listarr[1] = PROcomboBox.Text;
                    listarr[2] = PRICETXT.Text;
                    listarr[3] = QTYcomboBox.Text;
                    listarr[4] = PERAMTLBL.Text;
                    listarr[5] = (int.Parse(PRICETXT.Text) * int.Parse(QTYcomboBox.Text) - int.Parse(PERAMTLBL.Text)).ToString();

                    ListViewItem lvl = new ListViewItem(listarr);
                    BILLlistView.Items.Add(lvl);
                    total();
                }
                else
                {
                    listarr = new string[6];
                    listarr[0] = IDTXT.Text;
                    listarr[1] = PROcomboBox.Text;
                    listarr[2] = PRICETXT.Text;
                    listarr[3] = QTYcomboBox.Text;
                    listarr[4] = DISCOUNTTXT.Text;
                    listarr[5] = (int.Parse(PRICETXT.Text) * int.Parse(QTYcomboBox.Text) - int.Parse(DISCOUNTTXT.Text)).ToString();

                    ListViewItem lvl = new ListViewItem(listarr);
                    BILLlistView.Items.Add(lvl);
                    total();

                }
            }
            else
            {
                listarr = new string[6];
                listarr[0] = IDTXT.Text;
                listarr[1] = PROcomboBox.Text;
                listarr[2] = PRICETXT.Text;
                listarr[3] = QTYcomboBox.Text;
                listarr[4] = "0";
                listarr[5] = (int.Parse(PRICETXT.Text) * int.Parse(QTYcomboBox.Text)).ToString();

                ListViewItem lvl = new ListViewItem(listarr);
                BILLlistView.Items.Add(lvl);
                total();
            }
            if (MessageBox.Show("ADD MORE ITEMS TO BILL ?", "Confirm", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                CATcomboBox.Focus();
            }
            else
            {
               PAIDBYcomboBox.Focus();
            }
            CLEARVAL();
        }

        private void prodeletebtn_Click(object sender, EventArgs e)
        {
            try
            {
                BILLlistView.Items.RemoveAt(BILLlistView.SelectedIndices[0]);
                total();
            }catch(Exception EX)
            {
                MessageBox.Show(EX.Message);
            }
            

           
        }

        private void PROclear_Click(object sender, EventArgs e)
        {
            CATcomboBox.SelectedIndex = -1;
            IDTXT.Text = "";
            PROcomboBox.Text = "";
            PRICETXT.Text = "";
            QTYcomboBox.SelectedIndex = -1;
            stocklbl.Text = "";
            FLATradioButton.Checked = true;
            DISCOUNTTXT.Text = "";
            PERAMTLBL.Text = "";
            BILLlistView.Items.Clear();
            CATcomboBox.Focus();
        }

        void fetchinvoice()
        {
            try
            {

                connect = new SqlConnection(ConnectionString);
                SqlDataAdapter sda = new SqlDataAdapter("Select Invoice_no from BILLING order by Invoice_no desc", connect);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    INVOICEtxt.Text = (Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString()) + 1).ToString();
                }
                else
                {
                    INVOICEtxt.Text = "1000";
                }


                connect.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }
        void get_cust()
        {

            connect = new SqlConnection(ConnectionString);
            SqlCommand sqlCmd = new SqlCommand("select * from Customer", connect);
            connect.Open();

            SqlDataReader sqlReader = sqlCmd.ExecuteReader();

            while (sqlReader.Read())
            {
                CUSTcomboBox.Items.Add(sqlReader["NAME"].ToString());
            }

        }
        void get_ID()
        {

            connect = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand(getid, connect);
            SqlDataReader reader;
            try
            {
                connect.Open();
                reader = cmddb.ExecuteReader();
                reader.Read();
                IDTXT.Text = reader["ID"].ToString();
                connect.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        void get_price()
        {

            connect = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand(getprice, connect);
            SqlDataReader reader;
            try
            {
                connect.Open();
                reader = cmddb.ExecuteReader();
                reader.Read();
                PRICETXT.Text = reader["price"].ToString();
                connect.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        void get_Stock()
        {

            connect = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand(getstock, connect);
            SqlDataReader reader;
            try
            {
                connect.Open();
                reader = cmddb.ExecuteReader();
                reader.Read();
                stocklbl.Text = reader["quantity"].ToString();
                connect.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void PAIDBYcomboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            if(PAIDBYcomboBox.Text=="CASH")
            {
                methcomboBox.Focus();
            }
            if (PAIDBYcomboBox.Text == "CREDIT")
            {
                methcomboBox.Focus();
                PAIDBYLBL.ForeColor = Color.Red;
                
                
            }
           
            else
            {
                MessageBox.Show("PLZ SELECT PAID BY METHOD");
            }
        }

        private void PAIDAMTTXT_TextChanged(object sender, EventArgs e)
        {
            try
            {


                if (PAIDAMTTXT.Text.Length > 0)
                {
                    DUELBL.Text = (Convert.ToInt32(PAIDAMTTXT.Text) - Convert.ToInt32(TOTALLBL.Text)).ToString();

                }
                else
                {
                    DUELBL.Text = "0000";
                    PAIDAMTTXT.Focus();
                    
                }
                
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void methcomboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (PAIDBYcomboBox.Text == "CASH")
            {
                if (methcomboBox.Text == "ACCOUNT")
                {
                    ACCNOcomboBox.Enabled = true;
                    ACCNOcomboBox.Focus();
                    PAIDBYLBL.Text = "ACCOUNT :";
                    PAIDBYLBL.ForeColor = Color.Green;
                    PAIDAMTTXT.Text = TOTALLBL.Text;

                }
                else
                {
                    PAIDBYLBL.Text = "    CASH :";
                    ACCNOcomboBox.Text = "";
                    PAIDBYLBL.ForeColor = Color.Green;
                    PAIDAMTTXT.Text = TOTALLBL.Text;
                    BILLsavebtn.Focus();
                    ACCNOcomboBox.Enabled = false;
                }
            }
           if (PAIDBYcomboBox.Text == "CREDIT")
            {
                
                    if (methcomboBox.Text == "ACCOUNT")
                    {
                        PAIDBYLBL.Text = "ACCOUNT :";
                        PAIDAMTTXT.Focus();
                        ACCNOcomboBox.Enabled = true;
                    }
                    else
                    {
                        PAIDBYLBL.Text = "    CASH :";
                        PAIDAMTTXT.Focus();
                        ACCNOcomboBox.Text = ""; 
                        ACCNOcomboBox.Enabled = false;
                    }
                
            }
            else
            {
                MessageBox.Show("CHECK YOUR VALUES!!!");
            }
            }

        private void NEWradioButton_CheckedChanged(object sender, EventArgs e)
        {
            fetchinvoice();
            NEWradioButton.ForeColor = Color.RosyBrown;
            PREVradioButton.ForeColor = Color.Black;
            INVOICEtxt.Enabled = false;
            INVOICEtxt.ForeColor = Color.RosyBrown;
            
            BILLlistView.Visible = true;
            previusdataGridView.Visible = false;
        }

        private void PREVradioButton_CheckedChanged(object sender, EventArgs e)
        {
            PREVradioButton.ForeColor = Color.RosyBrown;
            NEWradioButton.ForeColor = Color.Black;
            INVOICEtxt.Enabled = true;
            INVOICEtxt.Focus();
            
            BILLlistView.Visible = false;
            previusdataGridView.Visible = true;
            dgvpopall();
        }

       
        private void dgvpop()
        {
            connect = new SqlConnection(ConnectionString);
            connect.Open();

            SqlDataAdapter adapter = new SqlDataAdapter("Select * from BILL WHERE INVOICE_NO like  '%" + INVOICEtxt.Text + "%'", connect);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            previusdataGridView.DataSource = dt;

            connect.Close();
        }
        private void dgvpopBYDATE()
        {
            connect = new SqlConnection(ConnectionString);
            connect.Open();

            SqlDataAdapter adapter = new SqlDataAdapter("Select * from BILL WHERE DATE like  '%" + dateTimePicker1.Text + "%'", connect);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            previusdataGridView.DataSource = dt;

            connect.Close();
        }
        private void dgvpopall()
        {
            connect = new SqlConnection(ConnectionString);
            connect.Open();

            SqlDataAdapter adapter = new SqlDataAdapter("Select * from BILLING ", connect);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            previusdataGridView.DataSource = dt;

            connect.Close();
        }

        private void INVOICEtxt_TextChanged(object sender, EventArgs e)
        {
            try
            {
                dgvpop();
            }
            catch (Exception EX)
            {
                MessageBox.Show(EX.Message);
            }
        }

        private void INVOICEtxt_Click(object sender, EventArgs e)
        {
            INVOICEtxt.Text = "";
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            DateTime datetime = DateTime.Now;
            labeltime.Text = datetime.ToString("T");
            labeldate.Text = datetime.ToString("D");
        }

        private void BILLsavebtn_Click(object sender, EventArgs e)
        {
            try
            {
                connect = new SqlConnection(ConnectionString);
                SqlCommand cmd = null;
                string cmdString = "";
                connect.Open();
                for (int i = 0; i < BILLlistView.Items.Count; i++)
                {

                    cmdString = "insert into BILLING values('" + INVOICEtxt.Text + "','" 
                    + CATcomboBox.Text + "','"
                    + BILLlistView.Items[i].SubItems[0].Text + "','"
                    + BILLlistView.Items[i].SubItems[1].Text + "','"
                    + BILLlistView.Items[i].SubItems[2].Text + "','"
                    + BILLlistView.Items[i].SubItems[3].Text + "','"
                    + BILLlistView.Items[i].SubItems[4].Text + "','"
                    + BILLlistView.Items[i].SubItems[5].Text + "','"
                    + PAIDBYcomboBox.Text + "','" 
                    + methcomboBox.Text + "','"
                    + TOTALLBL.Text + "','" 
                    + PAIDAMTTXT.Text + "','" 
                    + DUELBL.Text + "','"
                    + CUSTcomboBox.Text + "','" 
                    + ACCNOcomboBox.Text + "','" 
                    + this.dateTimePicker1.Text + "')";

                    cmd = new SqlCommand(cmdString, connect);
                    cmd.ExecuteNonQuery();
                }
                MessageBox.Show("Data Stored Successfully");
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message);
            }
        }   

        private void BILLupdatebtn_Click(object sender, EventArgs e)
        {

        }

        private void BILLDELBTN_Click(object sender, EventArgs e)
        {

        }

        private void dateTimePicker1_ValueChanged(object sender, EventArgs e)
        {
            dgvpopBYDATE();
        }

        private void CUSTcomboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            BILLsavebtn.Focus();
        }

        private void ACCNOcomboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            BILLsavebtn.Focus();
        }

        private void ACCNOcomboBox_KeyDown(object sender, KeyEventArgs e)
        {
            BILLsavebtn.Focus();
            //BILLsavebtn.BackColor = Color.Black;
        }

        private void EXPSAVEBTN_Click(object sender, EventArgs e)
        {

            try
            {
                connect = new SqlConnection(ConnectionString);
                SqlCommand cmd = null;
                string cmdString = "";
                connect.Open();
               
                    cmdString = "insert into EXPENSES values('" + DESCcomboBox.Text + "','"
                    + EXPAMOUNTTXT.Text + "','"
                    + EXPQTYcomboBox.Text + "','"
                    + TOTALAMTEXP.Text + "','"
                    + EXPSOURCEcomboBox.Text + "','"
                    + this.dateTimePicker1.Text + "')";

                    cmd = new SqlCommand(cmdString, connect);
                    cmd.ExecuteNonQuery();
                
                MessageBox.Show("Data Stored Successfully");
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message);
            }

        }

        private void EXPQTYcomboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            TOTALAMTEXP.Text = (int.Parse(EXPAMOUNTTXT.Text) * int.Parse(EXPQTYcomboBox.Text)).ToString();
        }

        public void total()
        {
            TOTALLBL.Text = "00000";
            if (BILLlistView.Items.Count > 0)
            {
                for (int i = 0; i < BILLlistView.Items.Count; i++)
                {
                    TOTALLBL.Text = (Convert.ToInt32(TOTALLBL.Text) + Convert.ToInt32(BILLlistView.Items[i].SubItems[5].Text)).ToString();
                }
            }

        }
        void CLEARVAL()
        {
           // CATcomboBox.Focus();
            
            IDTXT.Text = "";
            PROcomboBox.Text = "";
            PRICETXT.Text = "";
            QTYcomboBox.SelectedIndex = -1;
            stocklbl.Text = "";
            FLATradioButton.Checked = true;
            DISCOUNTTXT.Text = "";
            PERAMTLBL.Text = "";
            
        }
        void fetchproduct(string GETPRODUCT)
        {
            PROcomboBox.Items.Clear();
            connect = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand(GETPRODUCT, connect);
            SqlDataReader reader;
            try
            {
                connect.Open();
                reader = cmddb.ExecuteReader();
                while (reader.Read())
                {
                    string str = reader.GetString(0);
                    PROcomboBox.Items.Add(str);
                }
                connect.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }

        private void CATcomboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            CATEGORY = CATcomboBox.Text;
            if(CATEGORY == "MOBILE")
            {
                getproduct = "Select MODEL from " + CATEGORY + "";
                
            }
            else
                if (CATEGORY == "ACCESSORIES")
            {
                getproduct = "Select MODEL from " + CATEGORY + "";
            }
            else
            if (CATEGORY == "REPAIR")
            {
                getproduct = "Select ITEM from " + CATEGORY + "";
            }
            else
            {
                CATcomboBox.Focus();
            }
            

            fetchproduct(getproduct);
            PROcomboBox.Focus();
        }

        private void PROcomboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            sp = PROcomboBox.Text;
            getid= "select ID from " + CATEGORY + " where MODEL = '" + sp + "'";
            get_ID();
            getprice = "select price from " + CATEGORY + " where MODEL = '" + sp + "'";
            get_price();
            getstock = "select quantity from " + CATEGORY + " where MODEL = '" + sp + "'";
            get_Stock();
            QTYcomboBox.Focus();
        }
    }
}
