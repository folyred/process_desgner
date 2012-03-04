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
	
	//�ͻ��˶���
	private WebClient client = null;
	
	//�ļ�����Ŀ¼
	private String siteSaveFolder = "E:\\Site_Download";
	
	//ץȡ��վ����ַ
	private String siteUrl = "http://www.yongnian123.com";
	
	//��̬��Դ�б�
	private Map<String, StaticResourceModel> staticModels = new HashMap<String, StaticResourceModel>();
	
	public void start() throws Exception{
		
		//TODO �����طǱ�վ�ľ�̬��Դ������
		//TODO ������ץȡ�Ѿ�������ҳ��
		//TODO 9skb����д��������
		
		if(!siteSaveFolder.endsWith(File.separator)){
			siteSaveFolder += File.separator;
		}
		
		File saveFolder = new File(siteSaveFolder);
		if(!saveFolder.exists()){
			saveFolder.mkdirs();
		}
		
		staticModels.clear();
		
		client = new WebClient();
		//����css activex applet ʧЧ
		client.setActiveXNative(false);
		client.setAppletEnabled(false);
		client.setCssEnabled(false);
		client.setJavaScriptEnabled(false);
		//10�볬ʱ
		client.setTimeout(10 * 1000);
		
		fetchPage(siteUrl, "index.html");
		
		System.out.println("----------------------------------------------------------------------");
		
		
		System.out.println("[ �������ؾ�̬��Դ�ļ�... ]");
//		fetchStaticResources();
	}
	
	/**
	 * ץȡһ��ҳ��
	 * @param url
	 * @param fileName
	 * @throws Exception
	 * void 
	 * @author wx
	 */
	private void fetchPage(String url, String fileName) throws Exception{
		HtmlPage page = client.getPage(url);
		
		//html�ı�
		String html = page.getWebResponse().getContentAsString();
		
//		html = getStaticResources(page, html);
		
		html = changeStaticResources(page, html, url);
		saveHtmlPage(html, fileName);
	}
	
	/**
	 * ��ʽ����̬��Դ���ӵ�ַ����Ϊ����
	 * @param page
	 * @param html
	 * @return
	 * String 
	 * @author wx
	 */
	private String changeStaticResources(HtmlPage page, String html, String pageUrl){
		List<String> urlset = new ArrayList<String>();
		//js�ļ�
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
		
		//css��Դ
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
		
		//ͼƬ��Դ
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
	 * ȡ����̬��Դ�ļ�
	 * @param page
	 * @param html
	 * @return
	 * String 
	 * @author wx
	 */
	private String getStaticResources(HtmlPage page, String html){
		
		//js�ļ�
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
		
		//css��Դ
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
		
		//ͼƬ��Դ
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
	 * ����html�ı�
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
	 * ץȡ��ҳ��̬���ݣ� ����
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
			//ִ������
			GetMethod get = new GetMethod(model.getUrl());
			try {
				client.executeMethod(get);
				File path = new File(siteSaveFolder + model.savePath());
				if(!path.exists()){
					path.mkdirs();
				}
				File storeFile = new File(siteSaveFolder + model.getFilePath()); 
		        FileOutputStream output = new FileOutputStream(storeFile);  
		        //�õ�������Դ���ֽ�����,��д���ļ�  
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
