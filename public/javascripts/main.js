
import '../sass/main.scss'
import './function/confirmAction'
import'./function/quillEditor'
import'./function/admin'
import'./function/homePage'
import'./function/responsive'
import'./function/appendText'
import'./function/service'
import'./function/priceFilter'
import'./function/serviceImg'
import'./function/bookFunction'
import'./function/message'
import'./function/datePicker'

import { shortenText, dateFilter } from './function/descFilter.js'

shortenText();
dateFilter();
