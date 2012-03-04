package com.codeloger.core;


import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;



import com.codeloger.model.CssModel;
import com.codeloger.model.ImageModel;
import com.codeloger.model.ScriptModel;
import com.codeloger.model.StaticResourceModel;
import com.codeloger.util.HttpUtil;
import com.codeloger.util.StringUtil;
import com.gargoylesoftware.htmlunit.FailingHttpStatusCodeException;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class Picker {
	
	//客户端对象
	private WebClient client = null;
	
	//文件保存目录
	private String siteSaveFolder = "E:\\Site_Download";
	
	//抓取网站的网址
	private String siteUrl = "http://www.yongnian123.com";
	
	//静态资源列表
	private Map<String, StaticResourceModel> staticModels = new HashMap<String, StaticResourceModel>();
	
	public void start() throws Exception{
		
		//TODO 不下载非本站的静态资源与链接
		//TODO 不继续抓取已经爬过的页面
		//TODO 9skb链接写法的下载
		
		if(!siteSaveFolder.endsWith(File.separator)){
			siteSaveFolder += File.separator;
		}
		
		File saveFolder = new File(siteSaveFolder);
		if(!saveFolder.exists()){
			saveFolder.mkdirs();
		}
		
		staticModels.clear();
		
		client = new WebClient();
		//设置css activex applet 失效
		client.setActiveXNative(false);
		client.setAppletEnabled(false);
		client.setCssEnabled(false);
		client.setJavaScriptEnabled(false);
		//10秒超时
		client.setTimeout(10 * 1000);
		
		fetchPage(siteUrl, "index.html");
		
		System.out.println("----------------------------------------------------------------------");
		
		
		System.out.println("[ 正在下载静态资源文件... ]");
//		fetchStaticResources();
	}
	
	/**
	 * 抓取一个页面
	 * @param url
	 * @param fileName
	 * @throws Exception
	 * void 
	 * @author wx
	 */
	private void fetchPage(String url, String fileName) throws Exception{
		HtmlPage page = client.getPage(url);
		
		//html文本
		String html = page.getWebResponse().getContentAsString();
		
//		html = getStaticResources(page, html);
		
		html = changeStaticResources(page, html, url);
		saveHtmlPage(html, fileName);
	}
	
	/**
	 * 格式化静态资源链接地址，改为外链
	 * @param page
	 * @param html
	 * @return
	 * String 
	 * @author wx
	 */
	private String changeStaticResources(HtmlPage page, String html, String pageUrl){
		List<String> urlset = new ArrayList<String>();
		//js文件
		List<HtmlElement> scripts = page.getElementsByTagName("script");
		for (HtmlElement script : scripts) {
			if(script.hasAttribute("src")){
				String src = script.getAttribute("src");
				if(StringUtil.notEmpty(src) && staticModels.get(src) == null && !urlset.contains(src)){
					String newSrc = HttpUtil.getResourceStaticUrl(pageUrl, src);
					html = html.replace(src, newSrc);
					urlset.add(src);
				}
			}
		}
		
		//css资源
		List<HtmlElement> stylesheets = page.getElementsByTagName("link");
		for (HtmlElement style : stylesheets) {
			if(style.hasAttribute("type") 
					&& style.getAttribute("type").equalsIgnoreCase("text/css")
					&& style.hasAttribute("href")){
				String src = style.getAttribute("href");
				if(StringUtil.notEmpty(src) && staticModels.get(src) == null && !urlset.contains(src)){
					String newSrc = HttpUtil.getResourceStaticUrl(pageUrl, src);
					html = html.replace(src, newSrc);
					urlset.add(src);
				}
			}
		}
		
		//图片资源
		List<HtmlElement> images = page.getElementsByTagName("img");
		for (HtmlElement image : images) {
			if(image.hasAttribute("src")){
				String src = image.getAttribute("src");
				if(StringUtil.notEmpty(src) && staticModels.get(src) == null && !urlset.contains(src)){
					String newSrc = HttpUtil.getResourceStaticUrl(pageUrl, src);
					html = html.replace(src, newSrc);
					urlset.add(src);
				}
			}
		}
		return html;
	}
	
	/**
	 * 取出静态资源文件
	 * @param page
	 * @param html
	 * @return
	 * String 
	 * @author wx
	 */
	private String getStaticResources(HtmlPage page, String html){
		
		//js文件
		List<HtmlElement> scripts = page.getElementsByTagName("script");
		for (HtmlElement script : scripts) {
			if(script.hasAttribute("src")){
				String src = script.getAttribute("src");
				if(StringUtil.notEmpty(src) && staticModels.get(src) == null){
					ScriptModel model = new ScriptModel(src);
					html = html.replace(src, model.getFilePath());
					staticModels.put(src, model);
				}
			}
		}
		
		//css资源
		List<HtmlElement> stylesheets = page.getElementsByTagName("link");
		for (HtmlElement style : stylesheets) {
			if(style.hasAttribute("type") 
					&& style.getAttribute("type").equalsIgnoreCase("text/css")
					&& style.hasAttribute("href")){
				String src = style.getAttribute("href");
				if(StringUtil.notEmpty(src) && staticModels.get(src) == null){
					CssModel model = new CssModel(src);
					html = html.replace(src, model.getFilePath());
					staticModels.put(src, model);
				}
			}
		}
		
		//图片资源
		List<HtmlElement> images = page.getElementsByTagName("img");
		for (HtmlElement image : images) {
			if(image.hasAttribute("src")){
				String src = image.getAttribute("src");
				if(StringUtil.notEmpty(src) && staticModels.get(src) == null){
					ImageModel model = new ImageModel(src);
					html = html.replace(src, model.getFilePath());
					staticModels.put(src, model);
				}
			}
		}
		return html;
	}
	
	/**
	 * 保存html文本
	 * @param html
	 * void 
	 * @author Administrator
	 */
	private void saveHtmlPage(String html, String pageName){
		File file = new File(siteSaveFolder + pageName);
		try {
			FileOutputStream fos = new FileOutputStream(file);
			fos.write(html.getBytes());
			fos.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 抓取网页静态内容： 下载
	 * void 
	 * @author wx
	 */
	private void fetchStaticResources(){
		HttpClient client = new HttpClient();
		Set<String> urlSet = staticModels.keySet();
		Iterator<String> ite = urlSet.iterator();
		while(ite.hasNext()){
			String key = ite.next();
			StaticResourceModel model = staticModels.get(key);
			//执行下载
			GetMethod get = new GetMethod(model.getUrl());
			try {
				client.executeMethod(get);
				File path = new File(siteSaveFolder + model.savePath());
				if(!path.exists()){
					path.mkdirs();
				}
				File storeFile = new File(siteSaveFolder + model.getFilePath()); 
		        FileOutputStream output = new FileOutputStream(storeFile);  
		        //得到网络资源的字节数组,并写入文件  
		        output.write(get.getResponseBody());  
		        output.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	private void savePage(String url, String saveName){
		
	}
	
}
